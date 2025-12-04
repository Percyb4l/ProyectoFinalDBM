import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getReports, downloadReport } from "../../services/reportService";
import ReportModal from "../../components/ReportModal";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const loadReports = async () => {
    try {
      const res = await getReports();
      setReports(res.data);
    } catch (err) {
      console.error("Error obteniendo reportes:", err);
    }
  };

  const handleDownload = async (filePath) => {
    try {
      const res = await downloadReport(filePath);

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filePath.split("/").pop();
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error descargando archivo:", err);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <AdminLayout>
      <h1 className="admin-title">Reportes</h1>

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Reportes generados</h2>
          <button className="admin-btn-primary" onClick={() => setOpenModal(true)}>
            + Generar reporte
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Archivo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.title}</td>
                <td>{r.report_type}</td>
                <td>{r.created_at?.substring(0, 10)}</td>
                <td>{r.file_path || "No generado"}</td>

                <td>
                  {r.file_path ? (
                    <button
                      className="admin-btn-primary"
                      onClick={() => handleDownload(r.file_path)}
                    >
                      Descargar
                    </button>
                  ) : (
                    <span style={{ color: "#999" }}>Sin archivo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openModal && (
        <ReportModal close={() => setOpenModal(false)} refresh={loadReports} />
      )}
    </AdminLayout>
  );
};

export default ReportsPage;
