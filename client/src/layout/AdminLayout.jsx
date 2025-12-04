// src/layout/AdminLayout.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

      {/* Contenido */}
      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
