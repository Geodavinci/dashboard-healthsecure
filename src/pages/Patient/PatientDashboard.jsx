import { useEffect, useState } from "react";
import api from "../../services/api";

export default function PatientDashboard() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    api.get("/patient/me")
      .then(res => setPatient(res.data.patient))
      .catch(err => console.error(err));
  }, []);

  if (!patient) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Bienvenue {patient.first_name} 👋</h2>

      <p><strong>Nom :</strong> {patient.last_name}</p>
      <p><strong>Contact :</strong> {patient.contact}</p>
      <p><strong>Sexe :</strong> {patient.gender}</p>

      <hr />

      <h3>Consultations</h3>
      {patient.consultations.length === 0 ? (
        <p>Aucune consultation enregistrée</p>
      ) : (
        <ul>
          {patient.consultations.map(c => (
            <li key={c.id}>
              {c.date} — {c.diagnostic}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
