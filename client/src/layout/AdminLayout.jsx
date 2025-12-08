/**
 * @fileoverview Admin Layout Component (Layout Version)
 * 
 * Layout wrapper for admin pages with dynamic sidebar navigation.
 * Uses route location to highlight active menu items.
 * 
 * @module layout/AdminLayout
 * @requires react
 * @requires react-router-dom
 */

// src/layout/AdminLayout.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * AdminLayout Component
 * 
 * Provides consistent layout structure for admin pages with:
 * - Sidebar navigation with active route highlighting
 * - User information display
 * - Logout functionality
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to render in main area
 * 
 * @component
 * @returns {JSX.Element} Admin layout with sidebar and content area
 */
const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
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

  /**
   * Navigation menu items configuration
   * 
   * Defines all available admin navigation links with their paths.
   * Used to dynamically generate the sidebar menu.
   * 
   * @type {Array<Object>}
   * @property {string} label - Display text for menu item
   * @property {string} path - Route path for navigation
   */
  const menu = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Estaciones", path: "/admin/stations" },
    { label: "Instituciones", path: "/admin/institutions" },
    { label: "Sensores", path: "/admin/sensors" },
    { label: "Mediciones", path: "/admin/measurements" },
    { label: "Alertas", path: "/admin/alerts" },
    { label: "Usuarios", path: "/admin/users" },
    { label: "Solicitudes", path: "/admin/institutions/requests" },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">VriSA</div>

        <nav className="admin-menu">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              // Highlight active menu item based on current route
              className={`admin-menu-item ${location.pathname === item.path ? "admin-menu-item-active" : ""
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-user-box">
          <div className="admin-user-name">{user?.name}</div>
          <div className="admin-user-role">{user?.role}</div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
