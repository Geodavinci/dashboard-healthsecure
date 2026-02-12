import { useState } from "react";
import { 
  UserPlus, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  User, 
  Calendar,
  Phone,
  PlusCircle,
  XCircle,
  Key
} from "lucide-react";
import api from "./api/axios";

function AddPatient({ onAdded }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    contact: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post("/patients", form);

      setSuccess("Patient et compte ajoutés avec succès ✅");

      // 🔄 signal au parent pour recharger la liste
      if (onAdded) onAdded();

      // Reset du formulaire
      setForm({
        first_name: "",
        last_name: "",
        birth_date: "",
        gender: "",
        contact: "",
        email: "",
        password: "",
      });

      // Fermer le formulaire après succès
      setTimeout(() => {
        setShowForm(false);
        setSuccess(null);
      }, 2000);

    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Une erreur est survenue ❌");
      
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      birth_date: "",
      gender: "",
      contact: "",
      email: "",
      password: "",
    });
    setError(null);
    setSuccess(null);
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <button 
        className="add-patient-btn"
        onClick={() => setShowForm(true)}
      >
        <UserPlus size={20} />
        <span>Ajouter un patient</span>
      </button>
    );
  }

  return (
    <div className="add-patient-inline">
      {/* Header du formulaire */}
      <div className="form-header-inline">
        <div className="header-title">
          <UserPlus size={20} />
          <h3>Nouveau Patient</h3>
        </div>
        <button 
          className="close-btn-inline"
          onClick={resetForm}
          disabled={loading}
        >
          <XCircle size={20} />
        </button>
      </div>

      {/* Messages d'état */}
      <div className="status-messages-inline">
        {error && (
          <div className="error-message-inline">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message-inline">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="inline-form">
        <div className="form-grid-inline">
          {/* Prénom */}
          <div className="form-group-inline">
            <div className="input-group">
              <div className="input-icon-group">
                <User size={16} />
              </div>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Prénom"
                required
                className="form-input-inline"
                disabled={loading}
              />
            </div>
          </div>

          {/* Nom */}
          <div className="form-group-inline">
            <div className="input-group">
              <div className="input-icon-group">
                <User size={16} />
              </div>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Nom"
                required
                className="form-input-inline"
                disabled={loading}
              />
            </div>
          </div>

          {/* Date de naissance */}
          <div className="form-group-inline">
            <div className="input-group">
              <div className="input-icon-group">
                <Calendar size={16} />
              </div>
              <input
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
                className="form-input-inline"
                disabled={loading}
              />
            </div>
          </div>

          {/* Sexe */}
          <div className="form-group-inline">
            <div className="input-group">
              <div className="input-icon-group">
                <span>👤</span>
              </div>
              <select 
                name="gender" 
                value={form.gender} 
                onChange={handleChange}
                className="form-select-inline"
                disabled={loading}
              >
                <option value="">Sexe</option>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
                <option value="O">Autre</option>
              </select>
            </div>
          </div>

          {/* Contact */}
          <div className="form-group-inline full-width">
            <div className="input-group">
              <div className="input-icon-group">
                <Phone size={16} />
              </div>
              <input
                type="tel"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Téléphone"
                className="form-input-inline"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group-inline full-width">
            <div className="input-group">
              <div className="input-icon-group">
                <User size={16} />
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email du patient"
                required
                className="form-input-inline"
                disabled={loading}
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="form-group-inline full-width">
            <div className="input-group">
              <div className="input-icon-group">
                <Key size={16} />
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                required
                className="form-input-inline"
                disabled={loading}
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="form-group-inline action-buttons">
            <button
              type="button"
              className="cancel-btn-inline"
              onClick={resetForm}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="submit-btn-inline"
              disabled={loading || !form.first_name || !form.last_name || !form.email || !form.password}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Ajout...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Ajouter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddPatient;
