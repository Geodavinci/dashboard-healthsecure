import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function PatientStats({ consultations }) {

  // 🔹 Calculs statistiques
  const stats = useMemo(() => {
    const totalConsultations = consultations.length;

    // Comptage symptômes
    const symptomCount = {};
    consultations.forEach(c => {
      if (c.symptoms) {
        c.symptoms.split(",").forEach(s => {
          const key = s.trim().toLowerCase();
          if (key) symptomCount[key] = (symptomCount[key] || 0) + 1;
        });
      }
    });

    // Top 3 symptômes
    const topSymptoms = Object.entries(symptomCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Comptage diagnostics
    const diagnosisCount = {};
    consultations.forEach(c => {
      if (c.diagnosis) {
        const key = c.diagnosis.trim().toLowerCase();
        if (key) diagnosisCount[key] = (diagnosisCount[key] || 0) + 1;
      }
    });

    // Top 3 diagnostics
    const topDiagnostics = Object.entries(diagnosisCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Évolution consultations par mois
    const monthlyCount = {};
    consultations.forEach(c => {
      const month = new Date(c.date_consultation).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyCount[month] = (monthlyCount[month] || 0) + 1;
    });
    const chartData = Object.entries(monthlyCount).map(([month, count]) => ({ month, count }));

    return { totalConsultations, topSymptoms, topDiagnostics, chartData };
  }, [consultations]);

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, margin: "20px 0" }}>
      <h3>Statistiques Patient</h3>
      <p><strong>Total consultations :</strong> {stats.totalConsultations}</p>

      <p><strong>Top symptômes :</strong> {stats.topSymptoms.map(([s, count]) => `${s} (${count})`).join(", ") || "Aucun"}</p>
      <p><strong>Top diagnostics :</strong> {stats.topDiagnostics.map(([d, count]) => `${d} (${count})`).join(", ") || "Aucun"}</p>

      <h4>Évolution des consultations</h4>
      {stats.chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats.chartData}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>Aucune donnée pour le graphique</p>
      )}
    </div>
  );
}

export default PatientStats;
