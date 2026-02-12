export default function PatientConsultations({ consultations }) {
  return (
    <div>
      <h2>Mes consultations</h2>

      {consultations.length === 0 ? (
        <p>Aucune consultation</p>
      ) : (
        consultations.map(c => (
          <div key={c.id} style={{ marginBottom: 10 }}>
            <strong>Date :</strong> {c.date}<br />
            <strong>Motif :</strong> {c.reason}<br />
            <strong>Diagnostic :</strong> {c.diagnostic}
          </div>
        ))
      )}
    </div>
  );
}
