import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const AlertsPage = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const columns = [
        { key: "id", label: "ID", sortable: true },
        { key: "station_id", label: "Estación", sortable: true },
        { key: "variable_id", label: "Variable", sortable: true },
        { key: "message", label: "Mensaje", sortable: false },
        {
            key: "severity",
            label: "Severidad",
            sortable: true,
            render: (value) => (
                <span className={`severity-badge severity-${value}`}>
                    {value.toUpperCase()}
                </span>
            )
        },
        {
            key: "is_resolved",
            label: "Estado",
            sortable: true,
            render: (value) => (
                <span className={`status-badge ${value ? 'status-resolved' : 'status-active'}`}>
                    {value ? "Resuelta" : "Activa"}
                </span>
            )
        },
        {
            key: "created_at",
            label: "Fecha",
            sortable: true,
            render: (value) => new Date(value).toLocaleString('es-ES')
        }
    ];

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/alerts");
            setAlerts(res.data);
        } catch (error) {
            console.error("Error loading alerts:", error);
            alert("Error al cargar alertas");
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (alert) => {
        if (alert.is_resolved) return;

        try {
            await api.put(`/alerts/${alert.id}/resolve`);
            setAlerts(alerts.map(a =>
                a.id === alert.id ? { ...a, is_resolved: true, resolved_at: new Date() } : a
            ));
        } catch (error) {
            console.error("Error resolving alert:", error);
            alert("Error al resolver alerta");
        }
    };

    const filteredAlerts = alerts.filter(alert => {
        if (filter === "all") return true;
        if (filter === "active") return !alert.is_resolved;
        if (filter === "resolved") return alert.is_resolved;
        return alert.severity === filter;
    });

    return (
        <AdminLayout>
            <div className="page-header">
                <h1>Alertas</h1>
            </div>

            <div className="filter-section">
                <label>Filtrar:</label>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">Todas</option>
                    <option value="active">Activas</option>
                    <option value="resolved">Resueltas</option>
                    <option value="low">Severidad Baja</option>
                    <option value="medium">Severidad Media</option>
                    <option value="high">Severidad Alta</option>
                    <option value="critical">Severidad Crítica</option>
                </select>
            </div>

            <DataTable
                columns={columns}
                data={filteredAlerts}
                loading={loading}
                onEdit={handleResolve}
                emptyMessage="No hay alertas"
            />

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
        .filter-select {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          min-width: 200px;
        }
        .severity-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .severity-low {
          background: #dbeafe;
          color: #1e40af;
        }
        .severity-medium {
          background: #fef3c7;
          color: #92400e;
        }
        .severity-high {
          background: #fed7aa;
          color: #9a3412;
        }
        .severity-critical {
          background: #fee2e2;
          color: #991b1b;
        }
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .status-active {
          background: #fef3c7;
          color: #92400e;
        }
        .status-resolved {
          background: #d1fae5;
          color: #065f46;
        }
      `}</style>
        </AdminLayout>
    );
};

export default AlertsPage;
