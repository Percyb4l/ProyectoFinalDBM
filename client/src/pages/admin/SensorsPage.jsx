/**
 * @fileoverview Sensors Management Page Component
 * 
 * Provides interface for managing sensor devices installed at monitoring stations.
 * Features include station-based filtering, sensor creation, and status management.
 * 
 * @module pages/admin/SensorsPage
 * @requires react
 */

import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import api from "../../services/api";

/**
 * SensorsPage Component
 * 
 * Manages sensor devices with station-based filtering and creation capabilities.
 * Sensors are associated with stations and can have different statuses.
 * 
 * @component
 * @returns {JSX.Element} Sensor management interface
 */
const SensorsPage = () => {
    const [sensors, setSensors] = useState([]);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedStation, setSelectedStation] = useState("");
    const [formData, setFormData] = useState({
        station_id: "",
        model: "",
        brand: "",
        status: "active"
    });

    /**
     * Table column definitions
     * 
     * @type {Array<Object>}
     */
    const columns = [
        { key: "id", label: "ID", sortable: true },
        { key: "station_id", label: "ID Estación", sortable: true },
        { key: "model", label: "Modelo", sortable: true },
        { key: "brand", label: "Marca", sortable: true },
        {
            key: "status",
            label: "Estado",
            sortable: true,
            render: (value) => (
                <span className={`status-badge status-${value}`}>
                    {value === "active" ? "Activo" : "Inactivo"}
                </span>
            )
        }
    ];

    /**
     * Effect: Load stations on component mount
     * 
     * Stations are needed for the filter dropdown and form select.
     */
    useEffect(() => {
        loadStations();
    }, []);

    /**
     * Effect: Load sensors when station filter changes
     * 
     * Automatically loads sensors for the selected station.
     * Clears sensor list if no station is selected.
     */
    useEffect(() => {
        if (selectedStation) {
            loadSensors(selectedStation);
        } else {
            setSensors([]);
        }
    }, [selectedStation]);

    /**
     * Loads all stations from the API
     * 
     * @async
     * @function loadStations
     * @returns {Promise<void>}
     */
    const loadStations = async () => {
        try {
            const res = await api.get("/stations");
            setStations(res.data);
        } catch (error) {
            console.error("Error loading stations:", error);
        }
    };

    /**
     * Loads sensors for a specific station
     * 
     * @async
     * @param {string|number} stationId - Station ID to load sensors for
     * @returns {Promise<void>}
     */
    const loadSensors = async (stationId) => {
        try {
            setLoading(true);
            const res = await api.get(`/sensors/${stationId}`);
            setSensors(res.data);
        } catch (error) {
            console.error("Error loading sensors:", error);
            setSensors([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles form submission for creating a new sensor
     * 
     * Creates sensor and updates local state if it belongs to the currently selected station.
     * 
     * @async
     * @param {Event} e - Form submit event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/sensors", formData);
            // Only add to list if it matches the current filter
            if (selectedStation === formData.station_id.toString()) {
                setSensors([...sensors, res.data]);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error creating sensor:", error);
            alert("Error al crear sensor");
        }
    };

    /**
     * Closes the modal and resets form state
     */
    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            station_id: "",
            model: "",
            brand: "",
            status: "active"
        });
    };

    return (
        <AdminLayout>
            <div className="page-header">
                <h1>Gestión de Sensores</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    + Nuevo Sensor
                </button>
            </div>

            <div className="filter-section">
                <label>Filtrar por estación:</label>
                <select
                    value={selectedStation}
                    onChange={(e) => setSelectedStation(e.target.value)}
                    className="station-select"
                >
                    <option value="">Seleccione una estación</option>
                    {stations.map(station => (
                        <option key={station.id} value={station.id}>
                            {station.name}
                        </option>
                    ))}
                </select>
            </div>

            <DataTable
                columns={columns}
                data={sensors}
                loading={loading}
                emptyMessage={selectedStation ? "No hay sensores en esta estación" : "Seleccione una estación"}
            />

            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title="Nuevo Sensor"
            >
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label>Estación</label>
                        <select
                            value={formData.station_id}
                            onChange={(e) => setFormData({ ...formData, station_id: e.target.value })}
                            required
                        >
                            <option value="">Seleccione una estación</option>
                            {stations.map(station => (
                                <option key={station.id} value={station.id}>
                                    {station.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Modelo</label>
                        <input
                            type="text"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Marca</label>
                        <input
                            type="text"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Estado</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary">
                            Crear
                        </button>
                    </div>
                </form>
            </Modal>

            <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .page-header h1 {
          margin: 0;
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
        }
        .filter-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }
        .filter-section label {
          font-weight: 500;
          color: #374151;
        }
        .station-select {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          min-width: 250px;
        }
        .btn-primary {
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.625rem 1.25rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-primary:hover {
          background: #4f46e5;
        }
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: none;
          padding: 0.625rem 1.25rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }
        .form-group input,
        .form-group select {
          padding: 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
        }
        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .form-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .status-active {
          background: #d1fae5;
          color: #065f46;
        }
        .status-inactive {
          background: #fee2e2;
          color: #991b1b;
        }
      `}</style>
        </AdminLayout>
    );
};

export default SensorsPage;
