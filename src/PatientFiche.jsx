import { useEffect, useState } from "react";
import { useRef } from "react";
import { 
  ArrowLeft, 
  Download, 
  Loader2, 
  AlertCircle,
  User, 
  Calendar,
  Phone,
  FileText,
  Stethoscope,
  Pill,
  Shield,
  Building,
  Heart,
  Printer,
  Clock,
  BadgeCheck,
  Sparkles
} from "lucide-react";
import api from "./api/axios";
import PatientQrCode from "./PatientQrCode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./PatientFiche.css";

function PatientFiche({ patientId, onBack }) {
  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const ficheRef = useRef(null);

  const loadFiche = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/patients/${patientId}/consultations`);
      setPatient(res.data.patient);
      setConsultations(res.data.consultations || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger la fiche patient");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiche();
  }, [patientId]);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportPDF = async () => {
    if (!ficheRef.current || !patient) return;
    
    setExporting(true);
    try {
      const canvas = await html2canvas(ficheRef.current, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      const fileName = `Fiche_Medicale_${patient.first_name}_${patient.last_name}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      alert("PDF généré avec succès ✅");
    } catch (err) {
      console.error("Erreur PDF:", err);
      alert("Erreur lors de la génération du PDF ❌");
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="fiche-loading">
        <Loader2 size={40} className="spinner" />
        <p>Génération de la fiche médicale...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fiche-error">
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
      <div className="fiche-not-found">
        <AlertCircle size={48} />
        <h3>Patient introuvable</h3>
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={16} />
          Retour à la liste
        </button>
      </div>
    );
  }

  const patientAge = calculateAge(patient.birth_date);
  const lastConsultation = consultations.length > 0 
    ? consultations[consultations.length - 1]
    : null;

  return (
    <div className="patient-fiche-container">
      {/* Barre d'actions */}
      <div className="fiche-actions">
        <button onClick={onBack} className="action-button back">
          <ArrowLeft size={20} />
          <span>Retour au dossier</span>
        </button>
        <div className="action-buttons">
          <button 
            onClick={exportPDF} 
            className="action-button primary"
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 size={18} className="spinner-small" />
            ) : (
              <Download size={18} />
            )}
            <span>{exporting ? "Génération..." : "Télécharger PDF"}</span>
          </button>
          <button 
            onClick={handlePrint} 
            className="action-button secondary"
          >
            <Printer size={18} />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Contenu de la fiche */}
      <div ref={ficheRef} className="fiche-content">
        {/* En-tête institution */}
        <div className="fiche-header">
          <div className="institution-info">
            <div className="institution-logo">
              <Heart size={32} />
            </div>
            <div className="institution-details">
              <h1>Centre Médical HealthSecure</h1>
              <p className="institution-address">
                123 Avenue de la Santé, 75015 Lomé • Tél: 97010368
              </p>
              <p className="institution-cert">
                <BadgeCheck size={14} />
                Établissement de santé certifié • Agrément n° MED-2026-001
              </p>
            </div>
          </div>
          <div className="document-info">
            <div className="document-title">FICHE MÉDICALE DU PATIENT</div>
            <div className="document-id">Réf: FMP-{patient.id}-{new Date().getFullYear()}</div>
            <div className="document-date">
              Éditée le {new Date().toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="header-separator"></div>

        {/* Section identité patient */}
        <div className="patient-identity-section">
          <div className="section-title">
            <User size={20} />
            <h2>IDENTITÉ DU PATIENT</h2>
          </div>
          
          <div className="identity-grid">
            <div className="identity-field">
              <span className="field-label">Nom et prénom</span>
              <span className="field-value highlight">{patient.first_name} {patient.last_name}</span>
            </div>
            
            <div className="identity-field">
              <span className="field-label">Date de naissance</span>
              <span className="field-value">
                <Calendar size={16} />
                {patient.birth_date}
                {patientAge && <span className="age"> ({patientAge} ans)</span>}
              </span>
            </div>
            
            <div className="identity-field">
              <span className="field-label">Sexe</span>
              <span className="field-value">
                {patient.gender === 'M' ? 'Masculin' : 
                 patient.gender === 'F' ? 'Féminin' : 'Non spécifié'}
              </span>
            </div>
            
            <div className="identity-field">
              <span className="field-label">Contact</span>
              <span className="field-value contact">
                <Phone size={16} />
                {patient.contact || 'Non renseigné'}
              </span>
            </div>
            
            <div className="identity-field">
              <span className="field-label">Numéro patient</span>
              <span className="field-value patient-id">PAT-{patient.id}</span>
            </div>
            
            <div className="identity-field">
              <span className="field-label">Première consultation</span>
              <span className="field-value">
                {consultations.length > 0 
                  ? formatDate(consultations[0].date_consultation)
                  : 'Aucune consultation enregistrée'}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code d'identification */}
        <div className="qr-section">
          <div className="section-title">
            <FileText size={20} />
            <h2>IDENTIFICATION NUMÉRIQUE</h2>
          </div>
          <div className="qr-container">
            <PatientQrCode 
              token={patient.token} 
              patientName={`${patient.first_name} ${patient.last_name}`}
              size={120}
            />
            <div className="qr-details">
              <p className="qr-code-id">Code patient: {patient.token}</p>
              <p className="qr-instruction">Scannez ce code QR pour accéder au dossier numérique</p>
            </div>
          </div>
        </div>

        {/* Historique médical */}
        <div className="medical-history-section">
          <div className="section-title">
            <Stethoscope size={20} />
            <h2>HISTORIQUE MÉDICAL</h2>
            <span className="consultation-count">({consultations.length} consultation{consultations.length !== 1 ? 's' : ''})</span>
          </div>

          {consultations.length === 0 ? (
            <div className="empty-history">
              <p className="no-data-message">
                Aucune consultation médicale enregistrée pour ce patient.
              </p>
            </div>
          ) : (
            <div className="consultations-history">
              {consultations.map((consultation, index) => (
                <div key={consultation.id} className="consultation-record">
                  <div className="consultation-header">
                    <div className="consultation-number">Consultation n°{index + 1}</div>
                    <div className="consultation-date">
                      <Clock size={16} />
                      {formatDate(consultation.date_consultation)}
                    </div>
                  </div>
                  
                  <div className="consultation-details">
                    <div className="detail-row">
                      <span className="detail-label">
                        <Stethoscope size={16} />
                        Symptômes
                      </span>
                      <p className="detail-content">{consultation.symptoms || 'Non spécifié'}</p>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">
                        <FileText size={16} />
                        Diagnostic
                      </span>
                      <p className="detail-content">{consultation.diagnosis || 'Non spécifié'}</p>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">
                        <Pill size={16} />
                        Traitement prescrit
                      </span>
                      <p className="detail-content">{consultation.prescription || 'Aucun traitement'}</p>
                    </div>
                    
                    {consultation.notes && (
                      <div className="detail-row notes-row">
                        <span className="detail-label">Notes médicales</span>
                        <p className="detail-content notes">{consultation.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zone signatures et validations */}
        <div className="signatures-section">
          <div className="section-title">
            <Shield size={20} />
            <h2>VALIDATION MÉDICALE</h2>
          </div>
          
          <div className="signatures-grid">
            <div className="signature-block">
              <h3>Médecin traitant</h3>
              <div className="signature-area">
                <div className="signature-line"></div>
              </div>
              <p className="signature-info">Nom, prénom et signature</p>
              <div className="doctor-info">
                <span>Date: ________________</span>
                <span>Cachet: ______________</span>
              </div>
            </div>
            
            <div className="signature-block">
              <h3>Service médical</h3>
              <div className="signature-area">
                <div className="signature-line"></div>
              </div>
              <p className="signature-info">Cachet de l'établissement</p>
              <div className="stamp-info">
                <span>Validé le: _____________</span>
                <span>N° Dossier: __________</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer institutionnel */}
        <div className="fiche-footer">
          <div className="confidentiality-notice">
            <Shield size={16} />
            <p>
              <strong>CONFIDENTIALITÉ MÉDICALE :</strong> Ce document contient des informations médicales 
              confidentielles couvertes par le secret professionnel. Sa diffusion est strictement limitée 
              au patient et aux professionnels de santé directement impliqués dans sa prise en charge.
            </p>
          </div>
          
          <div className="footer-meta">
            <div className="footer-left">
              <p className="document-reference">
                Document: Fiche Médicale Patient • Réf: FMP-{patient.id} • Page 1/1
              </p>
              <p className="validity-period">
                Validité: 12 mois à compter de la dernière consultation
              </p>
            </div>
            
            <div className="footer-right">
              <p className="system-info">
                <Sparkles size={14} />
                Généré par HealthSecure • Système développé par <strong>geonel_dev</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="fiche-instructions">
        <div className="instructions-content">
          <AlertCircle size={20} />
          <div>
            <p><strong>Instructions :</strong></p>
            <ul>
              <li>Cette fiche est optimisée pour l'impression et l'archivage médical</li>
              <li>Utilisez le bouton "Télécharger PDF" pour une version numérique</li>
              <li>Les informations médicales sont confidentielles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientFiche;