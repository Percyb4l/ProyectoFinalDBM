import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import api from "../../services/api";

const StationsPage = () => {
  const [stations, setStations] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterInstitution, setFilterInstitution] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    status: "active",
    institution_id: null
  });

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Nombre", sortable: true },
    { 
      key: "institution_name", 
      label: "Institución", 
      sortable: true,
      render: (value) => value || "Sin institución"
    },
    { key: "latitude", label: "Latitud", sortable: true },
    { key: "longitude", label: "Longitud", sortable: true },
    {
      key: "status",
      label: "Estado",
      sortable: true,
      render: (value) => (
        <span className={`status-badge status-${value}`}>
          {value === "active" ? "Activa" : value === "inactive" ? "Inactiva" : "Mantenimiento"}
        </span>
      )
    }
  ];

  useEffect(() => {
    loadInstitutions();
    loadStations();
  }, []);

  useEffect(() => {
    loadStations();
  }, [searchTerm, filterStatus, filterInstitution]);

  const loadInstitutions = async () => {
    try {
      const res = await api.get("/institutions");
      setInstitutions(res.data);
    } catch (error) {
      console.error("Error loading institutions:", error);
    }
  };

  const loadStations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filterStatus) params.append("status", filterStatus);
      if (filterInstitution) params.append("institution_id", filterInstitution);
      
      const queryString = params.toString();
      const url = queryString ? `/stations?${queryString}` : "/stations";
      const res = await api.get(url);
      setStations(res.data);
    } catch (error) {
      console.error("Error loading stations:", error);
      alert("Error al cargar estaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      latitude: station.latitude,
      longitude: station.longitude,
      status: station.status,
      institution_id: station.institution_id
    });
    setShowModal(true);
  };

  const handleDelete = async (station) => {
    if (!confirm(`¿Eliminar la estación "${station.name}"?`)) return;

    try {
      await api.delete(`/stations/${station.id}`);
      setStations(stations.filter(s => s.id !== station.id));
    } catch (error) {
      console.error("Error deleting station:", error);
      alert("Error al eliminar estación");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      if (editingStation) {
        const res = await api.put(`/stations/${editingStation.id}`, payload);
        setStations(stations.map(s => s.id === editingStation.id ? res.data : s));
      } else {
        const res = await api.post("/stations", payload);
        setStations([...stations, res.data]);
      }

      handleCloseModal();
      loadStations(); // Reload to refresh filters
    } catch (error) {
      console.error("Error saving station:", error);
      alert("Error al guardar estación");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStation(null);
    setFormData({
      name: "",
      latitude: "",
      longitude: "",
      status: "active",
      institution_id: null
    });
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Gestión de Estaciones</h1>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nueva Estación
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="search">Buscar:</label>
          <input
            id="search"
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Estado:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            <option value="active">Activa</option>
            <option value="inactive">Inactiva</option>
            <option value="maintenance">Mantenimiento</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="institution-filter">Institución:</label>
          <select
            id="institution-filter"
            value={filterInstitution}
            onChange={(e) => setFilterInstitution(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas</option>
            {institutions.map(inst => (
              <option key={inst.id} value={inst.id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn-secondary"
          onClick={() => {
            setSearchTerm("");
            setFilterStatus("");
            setFilterInstitution("");
          }}
        >
          Limpiar filtros
        </button>
      </div>

      <DataTable
        columns={columns}
        data={stations}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay estaciones registradas"
      />

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingStation ? "Editar Estación" : "Nueva Estación"}
      >
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Nombre de la estación</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitud</label>
              <input
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Longitud</label>
              <input
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Activa</option>
                <option value="inactive">Inactiva</option>
                <option value="maintenance">Mantenimiento</option>
              </select>
            </div>

            <div className="form-group">
              <label>Institución</label>
              <select
                value={formData.institution_id || ""}
                onChange={(e) => setFormData({ ...formData, institution_id: e.target.value ? parseInt(e.target.value) : null })}
              >
                <option value="">Sin institución</option>
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseModal}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {editingStation ? "Actualizar" : "Crear"}
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
          padding: 1.5rem;
          background: var(--bg-primary);
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .search-input {
          padding: var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          font-size: 0.9rem;
          min-width: 250px;
          background: var(--bg-primary);
          color: var(--text-primary);
          transition: all var(--transition-base);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .filter-select {
          padding: var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          font-size: 0.9rem;
          min-width: 180px;
          background: var(--bg-primary);
          color: var(--text-primary);
          transition: all var(--transition-base);
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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

        .status-maintenance {
          background: #fef3c7;
          color: #92400e;
        }
      `}</style>
    </AdminLayout>
  );
};

export default StationsPage;