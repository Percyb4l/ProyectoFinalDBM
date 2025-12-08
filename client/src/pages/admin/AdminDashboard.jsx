/**
 * @fileoverview Admin Dashboard Page Component
 * 
 * Main dashboard page for administrators showing system statistics and quick access links.
 * Displays overview metrics for stations, institutions, sensors, and alerts.
 * 
 * @module pages/admin/AdminDashboard
 * @requires react
 */

import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import api from "../../services/api";

/**
 * AdminDashboard Component
 * 
 * Displays system-wide statistics and provides quick navigation to key admin functions.
 * Shows counts for stations, institutions, sensors, and alerts with visual cards.
 * 
 * @component
 * @returns {JSX.Element} Admin dashboard interface
 */
const AdminDashboard = () => {
  // Statistics state
  const [stats, setStats] = useState({
    stations: 0,
    institutions: 0,
    sensors: 0,
    alerts: 0,
    activeAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  /**
   * Effect: Load statistics on component mount
   * 
   * Fetches data from multiple endpoints in parallel for better performance.
   */
  useEffect(() => {
    loadStats();
  }, []);

  /**
   * Loads dashboard statistics from the API
   * 
   * Fetches counts for stations, institutions, and alerts in parallel.
   * Calculates active alerts count from the alerts data.
   * 
   * @async
   * @function loadStats
   * @returns {Promise<void>}
   */
  const loadStats = async () => {
    try {
      setLoading(true);
      // Fetch multiple endpoints in parallel for better performance
      const [stationsRes, institutionsRes, alertsRes] = await Promise.all([
        api.get("/stations"),
        api.get("/institutions"),
        api.get("/alerts")
      ]);

      setStats({
        stations: stationsRes.data.length,
        institutions: institutionsRes.data.length,
        sensors: 0, // TODO: Would need to aggregate from all stations
        alerts: alertsRes.data.length,
        // Count unresolved alerts for active alerts metric
        activeAlerts: alertsRes.data.filter(a => !a.is_resolved).length
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching statistics
  if (loading) {
    return (
      <AdminLayout>
        <div className="loading">Cargando dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="dashboard-title">Dashboard Administrativo</h1>
      <p className="dashboard-subtitle">Bienvenido al panel de administración de VriSA</p>

      {/* Statistics cards grid */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <div className="stat-value">{stats.stations}</div>
            <div className="stat-label">Estaciones</div>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">🏛️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.institutions}</div>
            <div className="stat-label">Instituciones</div>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">📡</div>
          <div className="stat-content">
            <div className="stat-value">{stats.sensors}</div>
            <div className="stat-label">Sensores</div>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeAlerts}</div>
            <div className="stat-label">Alertas Activas</div>
          </div>
        </div>
      </div>

      {/* Quick access links section */}
      <div className="info-section">
        <h2>Acceso Rápido</h2>
        <div className="quick-links">
          <a href="/admin/stations" className="quick-link">
            <span className="link-icon">🏢</span>
            <span>Gestionar Estaciones</span>
          </a>
          <a href="/admin/institutions" className="quick-link">
            <span className="link-icon">🏛️</span>
            <span>Gestionar Instituciones</span>
          </a>
          <a href="/admin/sensors" className="quick-link">
            <span className="link-icon">📡</span>
            <span>Gestionar Sensores</span>
          </a>
          <a href="/admin/alerts" className="quick-link">
            <span className="link-icon">⚠️</span>
            <span>Ver Alertas</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .dashboard-title {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
        }

        .dashboard-subtitle {
          margin: 0 0 2rem 0;
          color: #6b7280;
          font-size: 1rem;
        }

        .loading {
          padding: 3rem;
          text-align: center;
          color: #6b7280;
          font-size: 1.125rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          font-size: 3rem;
          line-height: 1;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .info-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .info-section h2 {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }

        .quick-links {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .quick-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
          text-decoration: none;
          color: #374151;
          font-weight: 500;
          transition: all 0.2s;
        }

        .quick-link:hover {
          background: #6366f1;
          color: white;
          transform: translateX(4px);
        }

        .link-icon {
          font-size: 1.5rem;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;
