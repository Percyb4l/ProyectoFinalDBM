/**
 * @fileoverview Settings Page Component
 * 
 * Provides interface for managing user profile, password, and institution settings.
 * Different sections are visible based on user role (admin vs regular user).
 * 
 * @module context/admin/SettingsPage
 * @requires react
 */

import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  getProfile,
  updateProfile,
  changePassword,
  getInstitution,
  updateInstitution,
} from "../../services/settingsService";
import { useAuth } from "../../context/AuthContext";

/**
 * SettingsPage Component
 * 
 * Manages user settings including:
 * - Profile information (name, email, role)
 * - Password changes
 * - Institution branding (for admin users)
 * 
 * @component
 * @returns {JSX.Element} Settings management interface
 */
const SettingsPage = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [institution, setInstitution] = useState({
    name: "",
    color_primary: "",
    color_secondary: "",
    logo_url: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
  });

  /**
   * Loads user profile and institution data
   * 
   * Fetches current user profile and associated institution (if user has institution_id).
   * 
   * @async
   * @function loadData
   * @returns {Promise<void>}
   */
  const loadData = async () => {
    const profileRes = await getProfile();
    setProfile(profileRes.data);

    // Load institution data if user is associated with one
    if (profileRes.data.institution_id) {
      const instRes = await getInstitution(profileRes.data.institution_id);
      setInstitution(instRes.data);
    }
  };

  /**
   * Effect: Load data on component mount
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Handles profile form input changes
   * 
   * @param {Event} e - Input change event
   */
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  /**
   * Handles institution form input changes
   * 
   * @param {Event} e - Input change event
   */
  const handleInstitutionChange = (e) => {
    const { name, value } = e.target;
    setInstitution((inst) => ({ ...inst, [name]: value }));
  };

  /**
   * Handles password form input changes
   * 
   * @param {Event} e - Input change event
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((p) => ({ ...p, [name]: value }));
  };

  /**
   * Saves profile changes
   * 
   * @async
   * @function saveProfile
   * @returns {Promise<void>}
   */
  const saveProfile = async () => {
    await updateProfile(profile);
    alert("Perfil actualizado correctamente");
  };

  /**
   * Saves institution settings
   * 
   * @async
   * @function saveInstitution
   * @returns {Promise<void>}
   */
  const saveInstitution = async () => {
    await updateInstitution(profile.institution_id, institution);
    alert("Institución actualizada");
  };

  /**
   * Saves password change
   * 
   * @async
   * @function savePassword
   * @returns {Promise<void>}
   */
  const savePassword = async () => {
    await changePassword({
      current: passwords.current,
      newPass: passwords.newPass,
    });

    setPasswords({ current: "", newPass: "" });
    alert("Contraseña actualizada");
  };

  return (
    <AdminLayout>
      <h1 className="admin-title">Configuración</h1>

      {/* USER PROFILE SECTION */}
      <div className="admin-section">
        <h2>Perfil de usuario</h2>

        <label className="modal-label">
          Nombre
          <input
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
          />
        </label>

        <label className="modal-label">
          Email
          <input name="email" value={profile.email} disabled />
        </label>

        <label className="modal-label">
          Rol
          <input name="role" value={profile.role} disabled />
        </label>

        <button className="admin-btn-primary" onClick={saveProfile}>
          Guardar cambios
        </button>
      </div>

      {/* PASSWORD CHANGE SECTION */}
      <div className="admin-section">
        <h2>Cambiar contraseña</h2>

        <label className="modal-label">
          Contraseña actual
          <input
            type="password"
            name="current"
            value={passwords.current}
            onChange={handlePasswordChange}
          />
        </label>

        <label className="modal-label">
          Nueva contraseña
          <input
            type="password"
            name="newPass"
            value={passwords.newPass}
            onChange={handlePasswordChange}
          />
        </label>

        <button className="admin-btn-primary" onClick={savePassword}>
          Actualizar contraseña
        </button>
      </div>

      {/* INSTITUTION SETTINGS SECTION (only for admin users) */}
      {profile.role.includes("admin_institucion") ||
      profile.role.includes("admin_general") ? (
        <div className="admin-section">
          <h2>Configuración de la institución</h2>

          <label className="modal-label">
            Nombre institución
            <input
              name="name"
              value={institution.name}
              onChange={handleInstitutionChange}
            />
          </label>

          <label className="modal-label">
            Color primario
            <input
              name="color_primary"
              type="color"
              value={institution.color_primary || "#000000"}
              onChange={handleInstitutionChange}
            />
          </label>

          <label className="modal-label">
            Color secundario
            <input
              name="color_secondary"
              type="color"
              value={institution.color_secondary || "#000000"}
              onChange={handleInstitutionChange}
            />
          </label>

          <label className="modal-label">
            URL del logo
            <input
              name="logo_url"
              value={institution.logo_url}
              onChange={handleInstitutionChange}
            />
          </label>

          <button className="admin-btn-primary" onClick={saveInstitution}>
            Guardar institución
          </button>
        </div>
      ) : null}
    </AdminLayout>
  );
};

export default SettingsPage;
