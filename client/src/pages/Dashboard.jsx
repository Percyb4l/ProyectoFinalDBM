/**
 * @fileoverview Public Dashboard Page Component
 * 
 * Public-facing dashboard displaying environmental monitoring data.
 * Shows air quality indicators, interactive map, filters, and historical trends.
 * This is the landing page for unauthenticated users.
 * 
 * @module pages/Dashboard
 * @requires react
 * @requires react-router-dom
 */

// src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import ChartManager from "../components/ChartManager";
import "./Dashboard.css";

// Debug: Verify import
console.log("Dashboard component loaded, ChartManager:", ChartManager);

/**
 * Dashboard Component
 * 
 * Public dashboard displaying environmental monitoring information.
 * Currently shows placeholder content for indicators, map, filters, and charts.
 * 
 * @component
 * @returns {JSX.Element} Public dashboard interface
 */
const Dashboard = () => {
  console.log("Dashboard component está renderizando");
  
  return (
    <div className="vrisa-layout" style={{ minHeight: '100vh', width: '100%' }}>
      {/* Top navigation bar */}
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

      {/* Main content area */}
      <main className="vrisa-main" style={{ padding: '20px', width: '100%' }}>
        {/* Test: Verify main is rendering */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: 'lime', 
          marginBottom: '20px',
          border: '3px solid red',
          fontSize: '18px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          TEST PRINCIPAL: Si ves esto, el Dashboard se está renderizando
        </div>

        {/* Indicator cards showing current air quality metrics */}
        <section className="vrisa-cards-row">
          {["ICA Actual", "PM2.5", "PM10", "O3"].map((title) => (
            <div key={title} className="vrisa-card">
              <h3>{title}</h3>
              {/* Placeholder for actual measurement value */}
              <div className="vrisa-card-value">[ ]</div>
              {/* Progress bar indicator */}
              <div className="vrisa-card-bar" />
            </div>
          ))}
        </section>

        {/* Map and filters section */}
        <section className="vrisa-grid">
          {/* Interactive map placeholder */}
          <div className="vrisa-map">
            <div className="vrisa-map-placeholder">
              [ MAPA INTERACTIVO ]
              <div className="vrisa-map-points">Puntos de monitoreo</div>
            </div>
          </div>

          {/* Data filters sidebar */}
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

        {/* Historical trends chart section */}
        <section 
          className="vrisa-chart-section" 
          style={{ 
            width: '100%', 
            padding: '30px',
            marginTop: '30px',
            marginBottom: '30px',
            display: 'block !important',
            visibility: 'visible !important',
            position: 'relative',
            zIndex: 100,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            border: '3px solid blue',
            minHeight: '300px'
          }}
        >
          {/* Test: Verify section is visible */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'yellow', 
            marginBottom: '20px',
            border: '3px solid red',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            TEST SECCIÓN: Si ves esto, la sección de gráficas está visible
          </div>
          <ChartManager />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
