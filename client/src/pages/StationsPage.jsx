/**
 * @fileoverview Stations Page Component (Alternative Version)
 * 
 * Alternative implementation of stations management page.
 * Uses StationModal component for station creation.
 * Note: This may be a duplicate of pages/admin/StationsPage.jsx
 * 
 * @module pages/StationsPage
 * @requires react
 */

import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import api from "../../services/api";
import StationModal from "../../components/StationModal";

/**
 * StationsPage Component
 * 
 * Displays list of stations with ability to create new ones via modal.
 * 
 * @component
 * @returns {JSX.Element} Stations listing interface
 */
const StationsPage = () => {
  const [stations, setStations] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  /**
   * Loads all stations from the API
   * 
   * @async
   * @function loadStations
   * @returns {Promise<void>}
   */
  const loadStations = async () => {
    const res = await api.get("/stations");
    setStations(res.data);
  };

  /**
   * Effect: Load stations on component mount
   */
  useEffect(() => {
    loadStations();
  }, []);

  return (
    <AdminLayout>
      <h1 className="admin-title">Estaciones</h1>

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Lista de estaciones</h2>
          <button className="admin-btn-primary" onClick={() => setOpenModal(true)}>
            + Registrar estación
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {stations.map((st) => (
              <tr key={st.id}>
                <td>{st.id}</td>
                <td>{st.name}</td>
                <td>{st.latitude}</td>
                <td>{st.longitude}</td>
                <td>{st.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Station creation modal */}
      {openModal && (
        <StationModal close={() => setOpenModal(false)} refresh={loadStations} />
      )}
    </AdminLayout>
  );
};

export default StationsPage;
