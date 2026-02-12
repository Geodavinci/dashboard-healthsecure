export default function PatientProfile({ patient }) {
  return (
    <div>
      <h2>Mon profil</h2>
      <p><strong>Nom :</strong> {patient.first_name} {patient.last_name}</p>
      <p><strong>Date de naissance :</strong> {patient.birth_date}</p>
      <p><strong>Email :</strong> {patient.user?.email}</p>
      <p><strong>Contact :</strong> {patient.contact}</p>
      <p><strong>Sexe :</strong> {patient.gender}</p> 
      
    </div>
  );
}
