/**
 * @fileoverview Station Modal Component
 * 
 * Comprehensive modal component for registering new monitoring stations.
 * Includes fields for station details, sensor information, variables, certificates, and credentials.
 * 
 * @module context/components/StationModal
 * @requires react
 */

// src/components/StationModal.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { createStation } from "../services/stationService";
import { getUsers } from "../services/userService";
import { uploadCertificate } from "../services/certificateService";

/**
 * StationModal Component
 * 
 * Provides a comprehensive form for registering new monitoring stations.
 * Saves complete station data including:
 * - Station basic info (name, coordinates, status)
 * - Technician assignment (technician_id)
 * - Sensor creation (model, brand)
 * - Variable associations (sensor_variables)
 * 
 * - Certificate upload (PDF/images) with type and expiration date
 * 
 * @param {Object} props - Component props
 * @param {Function} props.close - Callback to close the modal
 * @param {Function} props.refresh - Callback to refresh station list after creation
 * 
 * @component
 * @returns {JSX.Element} Station registration modal
 */
const StationModal = ({ close, refresh }) => {
  const [variables, setVariables] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  const [form, setForm] = useState({
    name: "",
    latitude: "",
    longitude: "",
    status: "active",
    institution_id: "",
    sensor_model: "",
    sensor_brand: "",
    technician_id: "",
    variable_ids: [],
    certificate_file: null,
    certificate_type: "calibracion",
    certificate_expiration_date: "",
    auto_credentials: "",
  });

  /**
   * Loads variables, technicians, and institutions from the API
   * 
   * Fetches available environmental variables, filters users to find
   * station operators who can be assigned as technicians, and loads institutions.
   * 
   * @async
   * @function loadData
   * @returns {Promise<void>}
   */
  const loadData = async () => {
    try {
      const [varsRes, usersRes, instRes] = await Promise.all([
        api.get("/variables"),
        getUsers(),
        api.get("/institutions")
      ]);

      setVariables(varsRes.data || []);
      setInstitutions(instRes.data || []);

      // Filter users to find station operators
      const techs = (usersRes.data || []).filter((u) =>
        u.role?.includes("operador_estacion")
      );
      setTechnicians(techs);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  /**
   * Effect: Load variables and technicians on component mount
   */
  useEffect(() => {
    loadData();
  }, []);

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
   * Toggles a variable in the selected variables list
   * 
   * Adds or removes a variable ID from the variable_ids array.
   * 
   * @param {string} id - Variable ID to toggle
   */
  const toggleVariable = (id) => {
    setForm((f) => ({
      ...f,
      variable_ids: f.variable_ids.includes(id)
        ? f.variable_ids.filter((v) => v !== id)
        : [...f.variable_ids, id],
    }));
  };

  /**
   * Handles certificate file selection
   * 
   * Stores the file object for later upload.
   * Validates file type and size.
   * 
   * @param {Event} e - File input change event
   */
  const handleCertificate = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setForm((f) => ({ ...f, certificate_file: null }));
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Tipo de archivo no permitido. Solo se permiten PDF e imágenes (JPEG, PNG, GIF, WEBP)");
      e.target.value = "";
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("El archivo es demasiado grande. El tamaño máximo es 10MB");
      e.target.value = "";
      return;
    }

    setForm((f) => ({ ...f, certificate_file: file }));
  };

  /**
   * Generates secure technical credentials
   * 
   * Creates a random credential string for station API access.
   * Format: "station_<random_string>"
   */
  const generateCredentials = () => {
    const random = Math.random().toString(36).slice(-10);
    const cred = `station_${random}`;
    setForm((f) => ({ ...f, auto_credentials: cred }));
  };

  /**
   * Handles form submission
   * 
   * Saves complete station data including:
   * - Basic station info (name, coordinates, status)
   * - Technician assignment (technician_id)
   * - Sensor creation (if model/brand provided)
   * - Variable associations (if variables selected)
   * - Certificate upload (if file provided)
   * 
   * @async
   * @param {Event} e - Form submit event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create the station first
      const stationData = {
        name: form.name,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        status: form.status || "active",
        institution_id: form.institution_id ? parseInt(form.institution_id) : null,
        technician_id: form.technician_id ? parseInt(form.technician_id) : null,
        sensor_model: form.sensor_model || null,
        sensor_brand: form.sensor_brand || null,
        variable_ids: form.variable_ids && form.variable_ids.length > 0 
          ? form.variable_ids 
          : []
      };

      const stationResponse = await createStation(stationData);
      const createdStation = stationResponse.data;
      
      console.log("Estación creada exitosamente:", createdStation);

      // Step 2: Upload certificate if file was provided
      if (form.certificate_file && createdStation.id) {
        try {
          const formData = new FormData();
          formData.append("certificate", form.certificate_file);
          formData.append("station_id", createdStation.id);
          formData.append("type", form.certificate_type);
          
          // Add expiration date if provided
          if (form.certificate_expiration_date) {
            formData.append("expiration_date", form.certificate_expiration_date);
          }

          // Add sensor_id if sensor was created
          if (createdStation.sensor && createdStation.sensor.id) {
            formData.append("sensor_id", createdStation.sensor.id);
          }

          await uploadCertificate(formData);
          console.log("Certificado subido exitosamente");
        } catch (certError) {
          console.error("Error subiendo certificado:", certError);
          // Don't fail the whole operation if certificate upload fails
          alert(`Estación creada, pero hubo un error al subir el certificado: ${certError.response?.data?.error || certError.message}`);
        }
      }
      
      refresh();
      close();
    } catch (err) {
      console.error("Error registrando estación:", err);
      const errorMessage = err.response?.data?.error || err.message || "Error al registrar estación";
      alert(`Error registrando estación: ${errorMessage}`);
    }
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-card modal-card-wide" onClick={(e) => e.stopPropagation()}>
        <h2>Registro de estación</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* FIRST BLOCK: Name + Sensor + Technician */}
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
                Estado
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </label>

              <label className="modal-label">
                Institución
                <select
                  name="institution_id"
                  value={form.institution_id}
                  onChange={handleChange}
                >
                  <option value="">Sin institución</option>
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
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

            {/* SECOND BLOCK: Coordinates and variables */}
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

          {/* THIRD BLOCK: Certificate + Credentials */}
          <div className="modal-row">
            <div className="modal-col">
              <label className="modal-label">
                Tipo de Certificado
                <select
                  name="certificate_type"
                  value={form.certificate_type}
                  onChange={handleChange}
                >
                  <option value="calibracion">Calibración</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </label>

              <label className="modal-label">
                Certificado (PDF o Imagen)
                <input 
                  type="file" 
                  accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp" 
                  onChange={handleCertificate} 
                />
              </label>

              {form.certificate_file && (
                <div className="certificate-preview">
                  Archivo seleccionado: <strong>{form.certificate_file.name}</strong>
                  <br />
                  Tamaño: {(form.certificate_file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}

              <label className="modal-label">
                Fecha de Expiración (Opcional)
                <input
                  type="date"
                  name="certificate_expiration_date"
                  value={form.certificate_expiration_date}
                  onChange={handleChange}
                />
              </label>
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
