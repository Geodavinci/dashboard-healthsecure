import { useState, useEffect } from "react";
import { 
  PlusCircle, 
  Edit2, 
  Loader2, 
  Calendar, 
  Activity,
  AlertCircle,
  Pill,
  FileText,
  CheckCircle,
  X,
  Stethoscope
} from "lucide-react";
import api from "./api/axios";

function AddConsultation({ patientId, onAdded, consultation }) {
  const [form, setForm] = useState({
    date_consultation: "",
    symptoms: "",
    diagnosis: "",
    prescription: "",
    notes: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // 🔹 Remplir le formulaire si on reçoit une consultation pour modifier
  useEffect(() => {
    if (consultation) {
      setForm({
        date_consultation: consultation.date_consultation || "",
        symptoms: consultation.symptoms || "",
        diagnosis: consultation.diagnosis || "",
        prescription: consultation.prescription || "",
        notes: consultation.notes || ""
      });
      setIsExpanded(true);
    } else {
      // Date par défaut = maintenant
      const now = new Date();
      const localDateTime = now.toISOString().slice(0, 16);
      
      setForm({
        date_consultation: localDateTime,
        symptoms: "",
        diagnosis: "",
        prescription: "",
        notes: ""
      });
      if (!consultation) setIsExpanded(false);
    }
  }, [consultation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (consultation) {
        // 🔹 Mode édition → PATCH
        await api.patch(`/consultations/${consultation.id}`, {
          patient_id: patientId,
          ...form
        });
        setSuccess("Consultation modifiée avec succès ✅");
      } else {
        // 🔹 Mode ajout → POST
        await api.post("/consultations", {
          patient_id: patientId,
          ...form
        });
        setSuccess("Consultation ajoutée avec succès ✅");
        
        // Réinitialiser le formulaire après ajout
        const now = new Date();
        const localDateTime = now.toISOString().slice(0, 16);
        setForm(prev => ({
          ...prev,
          symptoms: "",
          diagnosis: "",
          prescription: "",
          notes: "",
          date_consultation: localDateTime
        }));
      }

      if (onAdded) {
        // Attendre un peu avant de rafraîchir pour voir le message de succès
        setTimeout(() => {
          onAdded();
          if (!consultation) {
            setIsExpanded(false);
          }
        }, 1500);
      }
    } catch (err) {
      console.error("Erreur consultation:", err);
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement de la consultation ❌");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    const now = new Date();
    const localDateTime = now.toISOString().slice(0, 16);
    
    setForm({
      date_consultation: localDateTime,
      symptoms: "",
      diagnosis: "",
      prescription: "",
      notes: ""
    });
    setError(null);
    setSuccess(null);
    setIsExpanded(false);
  };

  const handleCancel = () => {
    if (consultation) {
      onAdded?.(); // Retour à la liste sans modification
    } else {
      resetForm();
    }
  };

  // Mode bouton simple (non étendu)
  if (!isExpanded && !consultation) {
    return (
      <button 
        className="add-consultation-trigger"
        onClick={() => setIsExpanded(true)}
      >
        <PlusCircle size={20} />
        <span>Nouvelle consultation</span>
      </button>
    );
  }

  return (
    <div className={`add-consultation-container ${consultation ? 'editing-mode' : ''}`}>
      {/* Header */}
      <div className="consultation-header">
        <div className="header-icon">
          {consultation ? <Edit2 size={24} /> : <Stethoscope size={24} />}
        </div>
        <div className="header-content">
          <h3>{consultation ? "Modifier la consultation" : "Nouvelle consultation médicale"}</h3>
          <p>{consultation ? "Mettre à jour les informations" : "Saisissez les détails de la consultation"}</p>
        </div>
        {!consultation && (
          <button 
            className="close-consultation-btn"
            onClick={resetForm}
            disabled={loading}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Messages d'état */}
      <div className="consultation-status">
        {error && (
          <div className="consultation-error">
            <AlertCircle size={18} />
            <div className="error-content">
              <strong>Erreur</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="consultation-success">
            <CheckCircle size={18} />
            <div className="success-content">
              <strong>Succès</strong>
              <p>{success}</p>
            </div>
          </div>
        )}
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="consultation-form">
        <div className="form-grid-consultation">
          {/* Date */}
          <div className="form-group-consultation date-group">
            <label className="form-label-consultation">
              <Calendar size={18} />
              <span>Date et heure</span>
            </label>
            <input
              type="datetime-local"
              name="date_consultation"
              value={form.date_consultation}
              onChange={handleChange}
              required
              className="form-input-consultation date-input"
              disabled={loading}
            />
          </div>

          {/* Symptômes */}
          <div className="form-group-consultation full-width">
            <label className="form-label-consultation">
              <Activity size={18} />
              <span>Symptômes</span>
              <span className="optional">(optionnel)</span>
            </label>
            <div className="textarea-wrapper">
              <textarea
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                placeholder="Décrivez les symptômes présentés par le patient..."
                className="form-textarea"
                disabled={loading}
                rows="3"
              />
              <div className="textarea-counter">
                {form.symptoms.length}/500
              </div>
            </div>
          </div>

          {/* Diagnostic */}
          <div className="form-group-consultation full-width">
            <label className="form-label-consultation">
              <AlertCircle size={18} />
              <span>Diagnostic</span>
              <span className="optional">(optionnel)</span>
            </label>
            <div className="textarea-wrapper">
              <textarea
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                placeholder="Indiquez le diagnostic établi..."
                className="form-textarea"
                disabled={loading}
                rows="3"
              />
              <div className="textarea-counter">
                {form.diagnosis.length}/500
              </div>
            </div>
          </div>

          {/* Prescription */}
          <div className="form-group-consultation full-width">
            <label className="form-label-consultation">
              <Pill size={18} />
              <span>Prescription</span>
              <span className="optional">(optionnel)</span>
            </label>
            <div className="textarea-wrapper">
              <textarea
                name="prescription"
                value={form.prescription}
                onChange={handleChange}
                placeholder="Détaillez le traitement prescrit..."
                className="form-textarea"
                disabled={loading}
                rows="3"
              />
              <div className="textarea-counter">
                {form.prescription.length}/500
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group-consultation full-width">
            <label className="form-label-consultation">
              <FileText size={18} />
              <span>Notes complémentaires</span>
              <span className="optional">(optionnel)</span>
            </label>
            <div className="textarea-wrapper">
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Ajoutez toute information complémentaire..."
                className="form-textarea"
                disabled={loading}
                rows="2"
              />
              <div className="textarea-counter">
                {form.notes.length}/200
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="consultation-actions">
          <button
            type="button"
            className="consultation-btn secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            {consultation ? "Annuler" : "Fermer"}
          </button>
          <button
            type="submit"
            className="consultation-btn primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spinner" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                {consultation ? <Edit2 size={18} /> : <PlusCircle size={18} />}
                <span>{consultation ? "Modifier" : "Ajouter la consultation"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddConsultation;