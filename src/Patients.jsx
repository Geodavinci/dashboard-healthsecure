import { useEffect, useState } from "react";
import { 
  Search, 
  Users, 
  PlusCircle, 
  FileText, 
  User, 
  Calendar,
  Filter,
  Download,
  Eye,
  Loader2,
  ChevronRight,
  Shield,
  Activity,
  AlertCircle,
  Sparkles
} from "lucide-react";
import api from "./api/axios";
import PatientDossier from "./PatientDossier";
import AddPatient from "./AddPatient";
import PatientFiche from "./PatientFiche";
import "./Patients.css";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [viewFicheId, setViewFicheId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // 🔹 Charger les patients
  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/patients");
      setPatients(res.data.patients || []);
    } catch (err) {
      console.error("Erreur chargement patients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // 🔹 Filtrage des patients
  const filteredPatients = patients.filter(p => {
    const matchesSearch = `${p.first_name} ${p.last_name}`.toLowerCase()
      .includes(search.toLowerCase());
    
    if (filter === "active") return matchesSearch && p.status === "active";
    if (filter === "inactive") return matchesSearch && p.status === "inactive";
    return matchesSearch;
  });

  // 🔹 Vue fiche PDF
  if (viewFicheId) {
    return (
      <PatientFiche
        patientId={viewFicheId}
        onBack={() => setViewFicheId(null)}
      />
    );
  }

  // 🔹 Vue dossier patient
  if (selectedPatientId) {
    return (
      <PatientDossier
        patientId={selectedPatientId}
        onBack={() => setSelectedPatientId(null)}
      />
    );
  }

  return (
    <div className="patients-container">
      {/* Header avec statistiques */}
      <div className="patients-header">
        <div className="header-content">
          <div className="header-title">
            <Users size={32} className="header-icon" />
            <div>
              <h1>Gestion des Patients</h1>
              <p className="header-subtitle">Carnet de santé numérique</p>
            </div>
          </div>
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{patients.length}</span>
                <span className="stat-label">Patients</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Activity size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-number">
                  {patients.filter(p => p.status === "active").length}
                </span>
                <span className="stat-label">Actifs</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Shield size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-number">
                  {patients.filter(p => p.urgence).length}
                </span>
                <span className="stat-label">Urgences</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="actions-bar">
        {/* Barre de recherche */}
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un patient par nom, prénom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filtres */}
        <div className="filters-container">
          <div className="filter-group">
            <Filter size={16} />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous les patients</option>
              <option value="active">Patients actifs</option>
              <option value="inactive">Patients inactifs</option>
            </select>
          </div>
        </div>

        {/* Bouton Ajouter */}
        <AddPatient onAdded={loadPatients} />
      </div>

      {/* Liste des patients */}
      <div className="patients-content">
        {loading ? (
          <div className="loading-container">
            <Loader2 size={40} className="loading-spinner" />
            <p>Chargement des patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="empty-state">
            <Users size={64} className="empty-icon" />
            <h3>Aucun patient trouvé</h3>
            <p>Aucun patient ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="patients-grid">
            {filteredPatients.map(patient => (
              <div key={patient.id} className="patient-card">
                <div className="patient-header">
                  <div className="patient-avatar">
                    <User size={24} />
                  </div>
                  <div className="patient-info">
                    <h3 className="patient-name">
                      {patient.first_name} {patient.last_name}
                    </h3>
                    <div className="patient-meta">
                      <span className="patient-id">ID: {patient.id}</span>
                      <span className={`patient-status ${patient.status}`}>
                        {patient.status === "active" ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  </div>
                  {patient.urgence && (
                    <div className="urgence-badge">
                      <AlertCircle size={12} />
                      <span>Urgent</span>
                    </div>
                  )}
                </div>

                <div className="patient-details">
                  {patient.date_naissance && (
                    <div className="detail-item">
                      <Calendar size={14} />
                      <span>Né(e) le {patient.date_naissance}</span>
                    </div>
                  )}
                  {patient.telephone && (
                    <div className="detail-item">
                      <span>📞 {patient.telephone}</span>
                    </div>
                  )}
                </div>

                <div className="patient-actions">
                  <button
                    onClick={() => setSelectedPatientId(patient.id)}
                    className="btn-action btn-primary"
                  >
                    <Eye size={16} />
                    <span>Voir dossier</span>
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => setViewFicheId(patient.id)}
                    className="btn-action btn-secondary"
                  >
                    <FileText size={16} />
                    <span>Fiche PDF</span>
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer avec signature */}
      <div className="patients-footer">
        <div className="footer-content">
          <div className="system-info">
            <Shield size={14} />
            <span>Système sécurisé • {patients.length} patients enregistrés</span>
          </div>
          <div className="geonel-signature">
            <Sparkles size={12} className="sparkle-icon" />
            <span className="signature-text">
              Conçu avec <span className="heart">❤️</span> par 
              <span className="dev-name"> geonel_dev</span>
            </span>
            <Sparkles size={12} className="sparkle-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Patients;