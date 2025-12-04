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

  const loadData = async () => {
    const profileRes = await getProfile();
    setProfile(profileRes.data);

    if (profileRes.data.institution_id) {
      const instRes = await getInstitution(profileRes.data.institution_id);
      setInstitution(instRes.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleInstitutionChange = (e) => {
    const { name, value } = e.target;
    setInstitution((inst) => ({ ...inst, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((p) => ({ ...p, [name]: value }));
  };

  const saveProfile = async () => {
    await updateProfile(profile);
    alert("Perfil actualizado correctamente");
  };

  const saveInstitution = async () => {
    await updateInstitution(profile.institution_id, institution);
    alert("Institución actualizada");
  };

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

      {/* PERFIL */}
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

      {/* CAMBIAR CONTRASEÑA */}
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

      {/* CONFIGURACIÓN INSTITUCIONAL */}
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
