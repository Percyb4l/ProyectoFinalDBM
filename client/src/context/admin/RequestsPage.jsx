/**
 * @fileoverview Requests Page Component
 * 
 * Provides interface for managing system requests including integration and maintenance requests.
 * Allows administrators to approve or reject requests.
 * 
 * @module context/admin/RequestsPage
 * @requires react
 */

import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  getAllRequests,
  approveIntegration,
  rejectIntegration,
  completeMaintenance,
} from "../../services/requestService";

/**
 * RequestsPage Component
 * 
 * Displays all system requests (integration and maintenance) in a unified table.
 * Provides actions to approve integration requests, complete maintenance requests,
 * and reject integration requests.
 * 
 * @component
 * @returns {JSX.Element} Requests management interface
 */
const RequestsPage = () => {
  const [requests, setRequests] = useState([]);

  /**
   * Loads all requests from the API
   * 
   * @async
   * @function loadRequests
   * @returns {Promise<void>}
   */
  const loadRequests = async () => {
    try {
      const res = await getAllRequests();
      setRequests(res.data);
    } catch (err) {
      console.error("Error cargando solicitudes:", err);
    }
  };

  /**
   * Handles request approval
   * 
   * Approves integration requests or completes maintenance requests
   * based on request type.
   * 
   * @async
   * @param {Object} req - Request object to approve
   * @param {string} req.type - Request type: 'integration' or 'maintenance'
   * @param {number} req.id - Request ID
   * @returns {Promise<void>}
   */
  const handleApprove = async (req) => {
    if (req.type === "integration") {
      await approveIntegration(req.id);
    } else if (req.type === "maintenance") {
      await completeMaintenance(req.id);
    }
    loadRequests(); // Reload to show updated status
  };

  /**
   * Handles request rejection
   * 
   * Rejects integration requests. Maintenance requests cannot be rejected.
   * 
   * @async
   * @param {Object} req - Request object to reject
   * @param {string} req.type - Request type (must be 'integration')
   * @param {number} req.id - Request ID
   * @returns {Promise<void>}
   */
  const handleReject = async (req) => {
    if (req.type === "integration") {
      await rejectIntegration(req.id);
    }
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
                {/* Format date to show only date portion */}
                <td>{req.date?.substring(0, 10)}</td>

                <td>
                  <button
                    className="admin-btn-primary"
                    onClick={() => handleApprove(req)}
                  >
                    Aprobar
                  </button>

                  {/* Only show reject button for integration requests */}
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
