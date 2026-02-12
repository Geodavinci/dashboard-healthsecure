import { useState } from "react";
import { 
  Heart, 
  Shield, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff,
  Stethoscope,
  Activity,
  Building,
  BadgeCheck,
  AlertCircle,
  LogIn,
  UserCheck
} from "lucide-react";
import api from "./api/axios";
import "./Login.css";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/login", formData);

      if (res.data.user) {
        onLogin();
      } else {
        setError("Email ou mot de passe incorrect");
      }
    } catch (err) {
      const errorMessage = err.response?.status === 401 
        ? "Email ou mot de passe incorrect"
        : "Une erreur est survenue. Veuillez réessayer.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background décoratif */}
      <div className="medical-background">
        <div className="background-pattern"></div>
        <div className="pulse-animation"></div>
        <Stethoscope className="decor-icon stethoscope" size={80} />
        <Activity className="decor-icon activity" size={60} />
        <Heart className="decor-icon heart" size={70} />
      </div>

      <div className="login-card">
        {/* Header avec logo */}
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon-wrapper">
              <Heart className="logo-heart" size={36} />
              <div className="logo-plus">+</div>
            </div>
            <div className="logo-text">
              <h1>
                <span className="logo-main">Health</span>
                <span className="logo-accent">Medical</span>
              </h1>
              <p className="logo-subtitle">
                <Building size={14} />
                <span>Carnet de Santé Numérique</span>
              </p>
            </div>
          </div>
          
          <div className="security-badge">
            <Shield size={16} />
            <span>Protocole HIPAA</span>
            <BadgeCheck size={16} />
          </div>
        </div>

        <div className="login-content">
          {/* Titre et sous-titre */}
          <div className="welcome-section">
            <h2 className="welcome-title">
              <UserCheck size={24} />
              Connexion Professionnelle
            </h2>
            <p className="welcome-subtitle">
              Accédez à votre espace médical sécurisé
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <div className="error-content">
                <strong>Attention</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={18} />
                <span>Email Professionnel</span>
              </label>
              <div className="input-container">
                <div className="input-icon">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="medecin@etablissement.fr"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="password-label-container">
                <label htmlFor="password" className="form-label">
                  <Lock size={18} />
                  <span>Mot de passe</span>
                </label>
                <a href="/forgot-password" className="forgot-password">
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="input-container">
                <div className="input-icon">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`submit-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              <div className="button-content">
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Se connecter</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Security Information */}
          <div className="security-info">
            <div className="security-item">
              <Shield size={20} className="security-icon" />
              <div className="security-text">
                <strong>Chiffrement AES-256</strong>
                <span>Données médicales sécurisées</span>
              </div>
            </div>
            <div className="security-item">
              <Lock size={20} className="security-icon" />
              <div className="security-text">
                <strong>Authentification 2FA</strong>
                <span>Double vérification d'identité</span>
              </div>
            </div>
            <div className="security-item">
              <Heart size={20} className="security-icon" />
              <div className="security-text">
                <strong>Certifié RGPD</strong>
                <span>Conforme protection des données</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <div className="footer-links">
              <a href="/privacy" className="footer-link">
                <Shield size={14} />
                Confidentialité
              </a>
              <a href="/terms" className="footer-link">
                <Lock size={14} />
                Conditions
              </a>
              <a href="/help" className="footer-link">
                <Heart size={14} />
                Assistance
              </a>
            </div>
            <p className="footer-copyright">
              © {new Date().getFullYear()} HealthMedical Pro v3.2.1
              <span className="footer-separator">•</span>
              Système Médical Certifié
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;