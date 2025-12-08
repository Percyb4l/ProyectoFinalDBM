/**
 * @fileoverview Admin Layout Component (Components Version)
 * 
 * Layout wrapper for admin pages with sidebar navigation and user info.
 * Provides consistent structure for all admin interface pages.
 * 
 * @module components/AdminLayout
 * @requires react
 * @requires react-router-dom
 */

import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLayout.css";

/**
 * AdminLayout Component
 * 
 * Wraps admin pages with a sidebar navigation menu and user information.
 * Handles logout functionality and provides navigation links to admin sections.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to render in main area
 * 
 * @component
 * @returns {JSX.Element} Admin layout with sidebar and content area
 */
const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles user logout
   * 
   * Clears authentication state and redirects to login page.
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">VriSA</div>

        <nav className="admin-menu">
          <Link to="/admin/dashboard" className="admin-menu-item">
            Dashboard
          </Link>

          <Link to="/admin/stations" className="admin-menu-item">
            Estaciones
          </Link>

          <Link to="/admin/reports" className="admin-menu-item">
            Reportes
          </Link>

          <Link to="/admin/settings" className="admin-menu-item">
            Configuración
          </Link>

          <Link
            to="/admin/institutions/requests"
            className="admin-menu-item"
          >
            Solicitudes
          </Link>

          <Link to="/admin/users" className="admin-menu-item">
            Usuarios
          </Link>
        </nav>

        <div className="admin-user-box">
          <div className="admin-user-name">{user?.name}</div>
          <div className="admin-user-role">{user?.role}</div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
