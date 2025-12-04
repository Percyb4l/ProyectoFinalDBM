// src/layout/AdminLayout.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menu = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Gestión Institucional", path: "/admin/institutions/requests" },
    { label: "Usuarios", path: "/admin/users" },
    { label: "Solicitudes", path: "/admin/requests" },
    { label: "Reportes", path: "/admin/reports" },
    { label: "Configuración", path: "/admin/settings" },
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
              className={`admin-menu-item ${
                location.pathname === item.path ? "admin-menu-item-active" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-user-box">
          <div className="admin-user-name">{user?.name}</div>
          <div className="admin-user-role">{user?.role}</div>
          <button className="admin-logout-btn" onClick={logout}>
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
