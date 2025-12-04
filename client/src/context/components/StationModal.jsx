// src/components/StationModal.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { createStation } from "../services/stationService";
import { getUsers } from "../services/userService";

const StationModal = ({ close, refresh }) => {
  const [variables, setVariables] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [form, setForm] = useState({
    name: "",
    latitude: "",
    longitude: "",
    status: "active",
    sensor_model: "",
    sensor_brand: "",
    technician_id: "",
    variable_ids: [],
    certificate_name: "",
    auto_credentials: "",
  });

  // Cargar variables y técnicos desde backend
  const loadData = async () => {
    try {
      const varsRes = await api.get("/variables");
      setVariables(varsRes.data || []);

      const usersRes = await getUsers();
      const techs = (usersRes.data || []).filter((u) =>
        u.role?.includes("operador_estacion")
      );
      setTechnicians(techs);
    } catch (err) {
      console.error("Error cargando variables/técnicos:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const toggleVariable = (id) => {
    setForm((f) => ({
      ...f,
      variable_ids: f.variable_ids.includes(id)
        ? f.variable_ids.filter((v) => v !== id)
        : [...f.variable_ids, id],
    }));
  };

  const handleCertificate = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // MOCKUP: solo guardamos el nombre del archivo
    setForm((f) => ({ ...f, certificate_name: file.name }));
  };

  const generateCredentials = () => {
    const random = Math.random().toString(36).slice(-10);
    const cred = `station_${random}`;
    setForm((f) => ({ ...f, auto_credentials: cred }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Por ahora, guardamos SOLO la estación en BD.
      // Lo demás es mockup visual. Si quieres, luego integramos sensores/variables/certificados.
      await createStation({
        name: form.name,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        status: "active",
      });

      refresh();
      close();
    } catch (err) {
      console.error("Error registrando estación:", err);
      alert("Error registrando estación. Revisa la consola.");
    }
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-card modal-card-wide" onClick={(e) => e.stopPropagation()}>
        <h2>Registro de estación</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* PRIMER BLOQUE: Nombre + Sensor + Técnico */}
          <div className="modal-row">
            <div className="modal-col">
              <label className="modal-label">
                Nombre de la estación
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="modal-label">
                Modelo del sensor
                <input
                  name="sensor_model"
                  value={form.sensor_model}
                  onChange={handleChange}
                />
              </label>

              <label className="modal-label">
                Marca del sensor
                <input
                  name="sensor_brand"
                  value={form.sensor_brand}
                  onChange={handleChange}
                />
              </label>

              <label className="modal-label">
                Responsable técnico
                <select
                  name="technician_id"
                  value={form.technician_id}
                  onChange={handleChange}
                >
                  <option value="">[Seleccionar]</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.email})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* SEGUNDO BLOQUE: Coordenadas y variables */}
            <div className="modal-col">
              <div className="modal-row">
                <label className="modal-label">
                  Latitud
                  <input
                    type="number"
                    step="0.000001"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="modal-label">
                  Longitud
                  <input
                    type="number"
                    step="0.000001"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <label className="modal-label">
                Variables medidas
                <div className="variables-grid">
                  {variables.length === 0 && (
                    <span className="variables-empty">
                      No hay variables registradas
                    </span>
                  )}
                  {variables.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`chip-btn ${
                        form.variable_ids.includes(v.id) ? "chip-btn-active" : ""
                      }`}
                      onClick={() => toggleVariable(v.id)}
                    >
                      {v.name} ({v.unit})
                    </button>
                  ))}
                </div>
              </label>
            </div>
          </div>

          {/* TERCER BLOQUE: Certificado + Credenciales */}
          <div className="modal-row">
            <div className="modal-col">
              <label className="modal-label">
                Certificado (PDF)
                <input type="file" accept="application/pdf" onChange={handleCertificate} />
              </label>

              {form.certificate_name && (
                <div className="certificate-preview">
                  Archivo seleccionado: <strong>{form.certificate_name}</strong>
                </div>
              )}
            </div>

            <div className="modal-col">
              <label className="modal-label">
                Credenciales técnicas
                <div className="credentials-box">
                  <div className="credentials-value">
                    {form.auto_credentials || "[Aún no generadas]"}
                  </div>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={generateCredentials}
                  >
                    Generar credenciales seguras
                  </button>
                </div>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn-secondary"
              onClick={close}
            >
              Cancelar
            </button>
            <button type="submit" className="modal-btn-primary">
              Registrar estación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StationModal;
