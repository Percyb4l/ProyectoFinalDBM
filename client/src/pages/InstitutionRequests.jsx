import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import api from "../../services/api";

const InstitutionRequests = () => {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const res = await api.get("/integrations");
      setRequests(res.data);
    } catch (err) {
      console.error("Error cargando solicitudes:", err);
    }
  };

  const handleApprove = async (id) => {
    await api.put(`/integrations/${id}/approve`);
    loadRequests();
  };

  const handleReject = async (id) => {
    await api.put(`/integrations/${id}/reject`);
    loadRequests();
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <AdminLayout>
      <h1 className="admin-title">Gestión Institucional</h1>

      <div className="admin-section">
        <h2>Solicitudes de Registro</h2>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Institución</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.station_name}</td>
                <td>{req.status}</td>
                <td>{req.requested_at?.substring(0, 10)}</td>

                <td>
                  <button
                    className="admin-btn-primary"
                    onClick={() => handleApprove(req.id)}
                  >
                    Aceptar
                  </button>
                  <button
                    className="admin-btn-secondary"
                    style={{ marginLeft: "6px" }}
                    onClick={() => handleReject(req.id)}
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default InstitutionRequests;
