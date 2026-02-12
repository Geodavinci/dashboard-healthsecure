import { useEffect, useState, useRef } from "react";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Filter, 
  Calendar,
  User, 
  Phone, 
  Edit2, 
  Trash2, 
  Loader2,
  Search,
  ChevronUp,
  ChevronDown,
  Printer,
  QrCode,
  BarChart3,
  PlusCircle,
  AlertCircle,
  Shield,
  Sparkles,
  Clock,
  Stethoscope,
  Pill,
  FilePlus
} from "lucide-react";
import api from "./api/axios";
import AddConsultation from "./AddConsultation";
import PatientQrCode from "./PatientQrCode";
import PatientStats from "./PatientStats";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./PatientDossier.css";

function PatientDossier({ patientId, onBack }) {
  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingConsultation, setEditingConsultation] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [exportingPDF, setExportingPDF] = useState(false);

  const dossierRef = useRef(null);

  const loadDossier = async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/patients/${patientId}/consultations`);
      setPatient(res.data.patient || null);
      setConsultations(res.data.consultations || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger le dossier du patient");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDossier();
  }, [patientId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette consultation ?")) return;
    try {
      await api.delete(`/consultations/${id}`);
      loadDossier();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression ❌");
    }
  };

  const handleEdit = (consultation) => {
    setEditingConsultation(consultation);
  };

  const handleUpdated = () => {
    setEditingConsultation(null);
    loadDossier();
  };

  // 🔹 Export PDF amélioré
  const exportPDF = async () => {
    if (!dossierRef.current || !patient) return;
    
    setExportingPDF(true);
    try {
      const canvas = await html2canvas(dossierRef.current, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${patient.first_name}_${patient.last_name}_Dossier_Medical_${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Notification visuelle
      alert("PDF généré avec succès ✅");
    } catch (err) {
      console.error("Erreur PDF:", err);
      alert("Erreur lors de la génération du PDF ❌");
    } finally {
      setExportingPDF(false);
    }
  };

  // Calcul de l'âge
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 size={40} className="spinner" />
        <p>Chargement du dossier médical...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertCircle size={48} />
        <h3>Erreur de chargement</h3>
        <p>{error}</p>
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={16} />
          Retour
        </button>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="not-found-container">
        <AlertCircle size={48} />
        <h3>Patient introuvable</h3>
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={16} />
          Retour à la liste
        </button>
      </div>
    );
  }

  const filteredConsultations = consultations
    .filter(c =>
      c.symptoms?.toLowerCase().includes(filter.toLowerCase()) ||
      c.diagnosis?.toLowerCase().includes(filter.toLowerCase()) ||
      c.prescription?.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.date_consultation) - new Date(b.date_consultation)
        : new Date(b.date_consultation) - new Date(a.date_consultation)
    );

  const patientAge = calculateAge(patient.birth_date);

  return (
    <div className="patient-dossier-container">
      {/* Header avec actions */}
      <div className="dossier-header">
        <div className="header-left">
          <button onClick={onBack} className="back-button">
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>
          <div className="patient-identity">
            <div className="patient-avatar-large">
              <User size={24} />
            </div>
            <div className="patient-info-header">
              <h1>
                {patient.first_name} {patient.last_name}
                {patientAge && <span className="patient-age">, {patientAge} ans</span>}
              </h1>
              <div className="patient-meta-header">
                <span className="meta-item">
                  <Calendar size={14} />
                  {patient.birth_date}
                </span>
                {patient.contact && (
                  <span className="meta-item">
                    <Phone size={14} />
                    {patient.contact}
                  </span>
                )}
                <span className="patient-id">ID: PAT-{patient.id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button 
            onClick={exportPDF} 
            className="action-button secondary"
            disabled={exportingPDF}
          >
            {exportingPDF ? (
              <Loader2 size={18} className="spinner-small" />
            ) : (
              <FileText size={18} />
            )}
            <span>{exportingPDF ? "Génération..." : "Exporter PDF"}</span>
          </button>
          <button className="action-button primary">
            <Printer size={18} />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div ref={dossierRef} className="dossier-content">
        {/* Section informations patient */}
        <div className="patient-info-section">
          <div className="section-header">
            <Shield size={20} />
            <h2>Informations Patient</h2>
          </div>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-label">Identité</div>
              <div className="info-value">{patient.first_name} {patient.last_name}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Date de naissance</div>
              <div className="info-value">
                {patient.birth_date}
                {patientAge && <span className="age-badge">{patientAge} ans</span>}
              </div>
            </div>
            <div className="info-card">
              <div className="info-label">Sexe</div>
              <div className="info-value">
                {patient.gender === 'M' ? 'Homme' : patient.gender === 'F' ? 'Femme' : 'Non spécifié'}
              </div>
            </div>
            <div className="info-card">
              <div className="info-label">Contact</div>
              <div className="info-value contact-value">
                <Phone size={16} />
                {patient.contact || 'Non renseigné'}
              </div>
            </div>
          </div>
        </div>

        {/* Widgets rapides */}
        <div className="widgets-section">
          <PatientQrCode 
            token={patient.token} 
            patientName={`${patient.first_name} ${patient.last_name}`} 
          />
          <PatientStats consultations={consultations} />
        </div>

        {/* Ajout consultation */}
        <div className="consultation-form-section">
          <AddConsultation
            patientId={patient.id}
            onAdded={editingConsultation ? handleUpdated : loadDossier}
            consultation={editingConsultation}
          />
        </div>

        {/* Barre de filtres */}
        <div className="filters-section">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher dans les consultations..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="search-input"
            />
            {filter && (
              <button 
                onClick={() => setFilter("")}
                className="clear-filter"
              >
                ×
              </button>
            )}
          </div>

          <div className="sort-container">
            <button 
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="sort-button"
            >
              <Filter size={16} />
              <span>Trier par date</span>
              {sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <div className="consultation-count">
              <FileText size={16} />
              <span>{filteredConsultations.length} consultation{filteredConsultations.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Liste des consultations */}
        <div className="consultations-section">
          <div className="section-header">
            <Stethoscope size={20} />
            <h2>Historique des Consultations</h2>
          </div>

          {filteredConsultations.length === 0 ? (
            <div className="empty-consultations">
              <FileText size={48} className="empty-icon" />
              <h3>Aucune consultation</h3>
              <p>{filter ? "Aucune consultation ne correspond à votre recherche" : "Aucune consultation enregistrée pour ce patient"}</p>
              {filter && (
                <button 
                  onClick={() => setFilter("")}
                  className="clear-search-button"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          ) : (
            <div className="consultations-grid">
              {filteredConsultations.map(consultation => (
                <div 
                  key={consultation.id} 
                  className={`consultation-card ${selectedConsultation === consultation.id ? 'selected' : ''}`}
                  onClick={() => setSelectedConsultation(
                    selectedConsultation === consultation.id ? null : consultation.id
                  )}
                >
                  <div className="consultation-header">
                    <div className="consultation-date">
                      <Calendar size={16} />
                      <span>{consultation.date_consultation}</span>
                    </div>
                    <div className="consultation-actions">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(consultation);
                        }}
                        className="action-btn edit-btn"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(consultation.id);
                        }}
                        className="action-btn delete-btn"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="consultation-content">
                    <div className="consultation-field">
                      <span className="field-label">
                        <Stethoscope size={14} />
                        Symptômes
                      </span>
                      <p className="field-value">{consultation.symptoms}</p>
                    </div>

                    <div className="consultation-field">
                      <span className="field-label">
                        <AlertCircle size={14} />
                        Diagnostic
                      </span>
                      <p className="field-value">{consultation.diagnosis}</p>
                    </div>

                    <div className="consultation-field">
                      <span className="field-label">
                        <Pill size={14} />
                        Prescription
                      </span>
                      <p className="field-value">{consultation.prescription}</p>
                    </div>
                  </div>

                  {consultation.notes && (
                    <div className="consultation-notes">
                      <span className="notes-label">Notes :</span>
                      <p>{consultation.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer avec signature */}
        <div className="dossier-footer">
          <div className="footer-content">
            <div className="system-info">
              <Shield size={14} />
              <span>Dossier médical sécurisé • Généré le {new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="geonel-signature">
              <Sparkles size={12} className="sparkle-icon" />
              <span className="signature-text">
                Système médical par <strong>geonel_dev</strong>
              </span>
              <Sparkles size={12} className="sparkle-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDossier;