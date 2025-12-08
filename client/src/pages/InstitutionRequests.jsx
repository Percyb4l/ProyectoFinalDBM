/**
 * @fileoverview Institution Requests Page Component (Alternative Version)
 * 
 * Alternative implementation for managing institution integration requests.
 * Allows administrators to approve or reject requests from institutions
 * to add their monitoring stations to the system.
 * 
 * @module pages/InstitutionRequests
 * @requires react
 */

import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import api from "../../services/api";

/**
 * InstitutionRequests Component
 * 
 * Displays integration requests and provides approve/reject functionality.
 * Requests are shown in a table with status and action buttons.
 * 
 * @component
 * @returns {JSX.Element} Institution requests management interface
 */
const InstitutionRequests = () => {
  const [requests, setRequests] = useState([]);

  /**
   * Loads all integration requests from the API
   * 
   * @async
   * @function loadRequests
   * @returns {Promise<void>}
   */
  const loadRequests = async () => {
    try {
      const res = await api.get("/integrations");
      setRequests(res.data);
    } catch (err) {
      console.error("Error cargando solicitudes:", err);
    }
  };

  /**
   * Approves an integration request
   * 
   * Marks the request as approved, which typically triggers station creation.
   * 
   * @async
   * @param {number} id - Integration request ID to approve
   * @returns {Promise<void>}
   */
  const handleApprove = async (id) => {
    await api.put(`/integrations/${id}/approve`);
    loadRequests(); // Reload to show updated status
  };

  /**
   * Rejects an integration request
   * 
   * Marks the request as rejected. Rejected requests are kept for audit purposes.
   * 
   * @async
   * @param {number} id - Integration request ID to reject
   * @returns {Promise<void>}
   */
  const handleReject = async (id) => {
    await api.put(`/integrations/${id}/reject`);
    loadRequests(); // Reload to show updated status
  };

  /**
   * Effect: Load requests on component mount
   */
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
                {/* Format date to show only date portion */}
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
