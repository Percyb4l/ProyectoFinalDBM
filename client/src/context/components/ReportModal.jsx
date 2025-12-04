import React, { useState, useEffect } from "react";
import { generateReport } from "../services/reportService";
import api from "../services/api";

const ReportModal = ({ close, refresh }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    report_type: "daily",
    station_id: "",
  });

  const [stations, setStations] = useState([]);

  const loadStations = async () => {
    const res = await api.get("/stations");
    setStations(res.data);
  };

  useEffect(() => {
    loadStations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await generateReport(form);
    refresh();
    close();
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Generar reporte</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="modal-label">
            Título del reporte
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>

          <label className="modal-label">
            Descripción
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <label className="modal-label">
            Tipo de reporte
            <select
              name="report_type"
              value={form.report_type}
              onChange={handleChange}
            >
              <option value="daily">Diario</option>
              <option value="monthly">Mensual</option>
              <option value="custom">Personalizado</option>
            </select>
          </label>

          <label className="modal-label">
            Estación
            <select
              name="station_id"
              value={form.station_id}
              onChange={handleChange}
            >
              <option value="">[Todas]</option>
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
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
              Generar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
