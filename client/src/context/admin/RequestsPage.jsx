import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  getAllRequests,
  approveIntegration,
  rejectIntegration,
  completeMaintenance,
} from "../../services/requestService";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const res = await getAllRequests();
      setRequests(res.data);
    } catch (err) {
      console.error("Error cargando solicitudes:", err);
    }
  };

  const handleApprove = async (req) => {
    if (req.type === "integration") {
      await approveIntegration(req.id);
    } else if (req.type === "maintenance") {
      await completeMaintenance(req.id);
    }
    loadRequests();
  };

  const handleReject = async (req) => {
    if (req.type === "integration") {
      await rejectIntegration(req.id);
    }
    loadRequests();
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <AdminLayout>
      <h1 className="admin-title">Solicitudes</h1>

      <div className="admin-section">
        <h2>Solicitudes del sistema</h2>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.type}</td>
                <td>{req.description}</td>
                <td>{req.status}</td>
                <td>{req.date?.substring(0, 10)}</td>

                <td>
                  <button
                    className="admin-btn-primary"
                    onClick={() => handleApprove(req)}
                  >
                    Aprobar
                  </button>

                  {req.type === "integration" && (
                    <button
                      className="admin-btn-danger"
                      style={{ marginLeft: "6px" }}
                      onClick={() => handleReject(req)}
                    >
                      Rechazar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default RequestsPage;
