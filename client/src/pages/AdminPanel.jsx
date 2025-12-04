// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [showStationForm, setShowStationForm] = useState(false);

  const [formStation, setFormStation] = useState({
    institution_id: null,
    name: "",
    latitude: "",
    longitude: "",
    status: "active",
  });

  // Cargar estaciones al entrar
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await api.get("/stations");
        setStations(res.data);
      } catch (error) {
        console.error("Error obteniendo estaciones:", error);
      } finally {
        setLoadingStations(false);
      }
    };

    fetchStations();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleStationChange = (e) => {
    const { name, value } = e.target;
    setFormStation((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateStation = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formStation,
        latitude: parseFloat(formStation.latitude),
        longitude: parseFloat(formStation.longitude),
      };
      const res = await api.post("/stations", payload);
      setStations((prev) => [...prev, res.data]);
      setShowStationForm(false);
      setFormStation({
        institution_id: null,
        name: "",
        latitude: "",
        longitude: "",
        status: "active",
      });
    } catch (error) {
      console.error("Error creando estación:", error.response?.data || error);
      alert("Error creando estación. Revisa la consola.");
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">VriSA</div>
        <nav className="admin-menu">
          <button className="admin-menu-item admin-menu-item-active">
            Dashboard
          </button>
          <button className="admin-menu-item">Gestión institucional</button>
          <button className="admin-menu-item">Usuarios</button>
          <button className="admin-menu-item">Solicitudes</button>
          <button className="admin-menu-item">Reportes</button>
          <button className="admin-menu-item">Configuración</button>
        </nav>
        <div className="admin-user-box">
          <div className="admin-user-name">{user?.name}</div>
          <div className="admin-user-role">{user?.role}</div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="admin-main">
        <h1 className="admin-title">Gestión institucional</h1>

        <section className="admin-section">
          <div className="admin-section-header">
            <h2>Estaciones registradas</h2>
            <button
              className="admin-btn-primary"
              onClick={() => setShowStationForm(true)}
            >
              + Registrar estación
            </button>
          </div>

          {loadingStations ? (
            <p>Cargando estaciones...</p>
          ) : stations.length === 0 ? (
            <p>No hay estaciones registradas.</p>
          ) : (
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
          )}
        </section>

        {/* Modal / panel para registrar estación */}
        {showStationForm && (
          <div className="modal-backdrop" onClick={() => setShowStationForm(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h2>Registro de nueva estación</h2>
              <form className="modal-form" onSubmit={handleCreateStation}>
                <label className="modal-label">
                  Nombre de la estación
                  <input
                    type="text"
                    name="name"
                    value={formStation.name}
                    onChange={handleStationChange}
                    required
                  />
                </label>

                <div className="modal-row">
                  <label className="modal-label">
                    Latitud
                    <input
                      type="number"
                      step="0.000001"
                      name="latitude"
                      value={formStation.latitude}
                      onChange={handleStationChange}
                      required
                    />
                  </label>
                  <label className="modal-label">
                    Longitud
                    <input
                      type="number"
                      step="0.000001"
                      name="longitude"
                      value={formStation.longitude}
                      onChange={handleStationChange}
                      required
                    />
                  </label>
                </div>

                <label className="modal-label">
                  Estado
                  <select
                    name="status"
                    value={formStation.status}
                    onChange={handleStationChange}
                  >
                    <option value="active">Activa</option>
                    <option value="inactive">Inactiva</option>
                    <option value="maintenance">Mantenimiento</option>
                  </select>
                </label>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-btn-secondary"
                    onClick={() => setShowStationForm(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="modal-btn-primary">
                    Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
