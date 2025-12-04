import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import api from "../../services/api";
import StationModal from "../../components/StationModal";

const StationsPage = () => {
  const [stations, setStations] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const loadStations = async () => {
    const res = await api.get("/stations");
    setStations(res.data);
  };

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

      {openModal && (
        <StationModal close={() => setOpenModal(false)} refresh={loadStations} />
      )}
    </AdminLayout>
  );
};

export default StationsPage;
