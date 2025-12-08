/**
 * @fileoverview User Modal Component
 * 
 * Modal component for creating new users.
 * Provides a form with fields for name, email, password, and role selection.
 * 
 * @module context/components/UserModal
 * @requires react
 */

import React, { useState } from "react";
import { createUser } from "../services/userService";

/**
 * UserModal Component
 * 
 * Displays a modal form for creating new user accounts.
 * Supports multiple user roles including admin, operator, researcher, and citizen.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.close - Callback to close the modal
 * @param {Function} props.refresh - Callback to refresh user list after creation
 * 
 * @component
 * @returns {JSX.Element} User creation modal
 */
const UserModal = ({ close, refresh }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "operador_estacion", // Default role
  });

  /**
   * Handles form input changes
   * 
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  /**
   * Handles form submission
   * 
   * Creates a new user and refreshes the user list.
   * 
   * @async
   * @param {Event} e - Form submit event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    await createUser(form);
    refresh();
    close();
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Crear nuevo usuario</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="modal-label">
            Nombre
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="modal-label">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="modal-label">
            Contraseña
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <label className="modal-label">
            Rol
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="admin_general">Admin General</option>
              <option value="admin_institucion">Admin Institución</option>
              <option value="operador_estacion">Operador Estación</option>
              <option value="investigador">Investigador</option>
              <option value="ciudadano">Ciudadano</option>
            </select>
          </label>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn-secondary"
              onClick={close}
            >
              Cancelar
            </button>
            <button type="submit" className="modal-btn-primary">
              Crear usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
