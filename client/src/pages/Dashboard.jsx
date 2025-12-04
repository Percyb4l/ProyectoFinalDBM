// src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // si quieres separar estilos, o usa App.css

const Dashboard = () => {
  return (
    <div className="vrisa-layout">
      {/* Barra superior */}
      <header className="vrisa-topbar">
        <div className="vrisa-logo">VriSA</div>
        <nav className="vrisa-menu">
          <button className="vrisa-tab vrisa-tab-active">Dashboard</button>
          <button className="vrisa-tab">Estaciones</button>
          <button className="vrisa-tab">Reportes</button>
          <button className="vrisa-tab">Configuración</button>
        </nav>
        <div className="vrisa-login-btn">
          <Link to="/login">Acceso administrativo</Link>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="vrisa-main">
        {/* Tarjetas de indicadores */}
        <section className="vrisa-cards-row">
          {["ICA Actual", "PM2.5", "PM10", "O3"].map((title) => (
            <div key={title} className="vrisa-card">
              <h3>{title}</h3>
              <div className="vrisa-card-value">[ ]</div>
              <div className="vrisa-card-bar" />
            </div>
          ))}
        </section>

        <section className="vrisa-grid">
          {/* Mapa */}
          <div className="vrisa-map">
            <div className="vrisa-map-placeholder">
              [ MAPA INTERACTIVO ]
              <div className="vrisa-map-points">Puntos de monitoreo</div>
            </div>
          </div>

          {/* Filtros */}
          <aside className="vrisa-filters">
            <h3>Filtros de datos</h3>

            <label className="vrisa-filter-label">
              Contaminante
              <select className="vrisa-select">
                <option>[Seleccionar]</option>
              </select>
            </label>

            <label className="vrisa-filter-label">
              Período de tiempo
              <select className="vrisa-select">
                <option>[Seleccionar]</option>
              </select>
            </label>

            <label className="vrisa-filter-label">
              Estación
              <select className="vrisa-select">
                <option>[Todas]</option>
              </select>
            </label>

            <button className="vrisa-btn-primary">Aplicar filtros</button>
          </aside>
        </section>

        {/* Tendencias históricas */}
        <section className="vrisa-chart-section">
          <h3>Tendencias históricas</h3>
          <div className="vrisa-chart-placeholder">
            [ GRÁFICA DE TENDENCIA ]
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
