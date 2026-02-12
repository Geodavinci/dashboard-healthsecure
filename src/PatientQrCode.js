import { QRCodeCanvas } from "qrcode.react";

function PatientQrCode({ token, patientName }) {
  const qrValue = `http://127.0.0.1:8000/api/scan-qr/${token}`;

  return (
    <div style={{
      marginTop: 20,
      padding: 10,
      border: "1px solid #ccc",
      borderRadius: 8,
      display: "inline-block",
      textAlign: "center"
    }}>
      <h3>QR Code du patient</h3>
      {patientName && <p style={{ fontWeight: "bold", marginBottom: 10 }}>{patientName}</p>}

      <QRCodeCanvas
        value={qrValue}
        size={200}
      />

      <p style={{ fontSize: 12, marginTop: 10 }}>
        Scanner ce code pour accéder au dossier médical
      </p>
    </div>
  );
}

export default PatientQrCode;
