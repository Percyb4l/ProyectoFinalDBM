import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const MeasurementsPage = () => {
    const [measurements, setMeasurements] = useState([]);
    const [stations, setStations] = useState([]);
    const [variables, setVariables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStation, setSelectedStation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedVariable, setSelectedVariable] = useState("");

    const columns = [
        { key: "id", label: "ID", sortable: true },
        { key: "station_id", label: "Estación", sortable: true },
        { key: "sensor_id", label: "Sensor", sortable: true },
        { key: "variable_id", label: "Variable", sortable: true },
        {
            key: "value",
            label: "Valor",
            sortable: true,
            render: (value, row) => `${value} ${row.unit || getUnit(row.variable_id)}`
        },
        {
            key: "variable_name",
            label: "Variable",
            sortable: true,
            render: (value, row) => value || row.variable_id
        },
        {
            key: "timestamp",
            label: "Fecha/Hora",
            sortable: true,
            render: (value) => new Date(value).toLocaleString('es-ES')
        }
    ];

    const getUnit = (variableId) => {
        const units = {
            'PM25': 'µg/m³',
            'PM10': 'µg/m³',
            'NO2': 'ppb',
            'O3': 'ppb',
            'CO': 'ppm',
            'TEMP': '°C',
            'HUM': '%',
            'WIND': 'm/s'
        };
        return units[variableId] || '';
    };

    useEffect(() => {
        loadStations();
        loadVariables();
    }, []);

    useEffect(() => {
        if (selectedStation) {
            loadMeasurements(selectedStation);
        } else {
            setMeasurements([]);
        }
    }, [selectedStation, startDate, endDate, selectedVariable]);

    const loadStations = async () => {
        try {
            const res = await api.get("/stations");
            setStations(res.data);
        } catch (error) {
            console.error("Error loading stations:", error);
        }
    };

    const loadVariables = async () => {
        try {
            const res = await api.get("/variables");
            setVariables(res.data);
        } catch (error) {
            console.error("Error loading variables:", error);
        }
    };

    const loadMeasurements = async (stationId) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            if (selectedVariable) params.append("variable_id", selectedVariable);
            
            const queryString = params.toString();
            const url = `/measurements/station/${stationId}${queryString ? `?${queryString}` : ""}`;
            const res = await api.get(url);
            setMeasurements(res.data);
        } catch (error) {
            console.error("Error loading measurements:", error);
            setMeasurements([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setStartDate("");
        setEndDate("");
        setSelectedVariable("");
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getWeekAgoDate = () => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return weekAgo.toISOString().split('T')[0];
    };

    return (
        <AdminLayout>
            <div className="page-header">
                <h1>Mediciones</h1>
            </div>

            <div className="filter-section">
                <div className="filter-group">
                    <label>Estación:</label>
                    <select
                        value={selectedStation}
                        onChange={(e) => setSelectedStation(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Seleccione una estación</option>
                        {stations.map(station => (
                            <option key={station.id} value={station.id}>
                                {station.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Variable:</label>
                    <select
                        value={selectedVariable}
                        onChange={(e) => setSelectedVariable(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Todas</option>
                        {variables.map(variable => (
                            <option key={variable.id} value={variable.id}>
                                {variable.name} ({variable.unit})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Fecha inicio:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        max={endDate || getTodayDate()}
                        className="date-input"
                    />
                </div>

                <div className="filter-group">
                    <label>Fecha fin:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        max={getTodayDate()}
                        className="date-input"
                    />
                </div>

                <div className="filter-actions">
                    <button
                        className="btn-secondary"
                        onClick={() => {
                            setStartDate(getWeekAgoDate());
                            setEndDate(getTodayDate());
                        }}
                        title="Últimos 7 días"
                    >
                        Últimos 7 días
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={handleClearFilters}
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={measurements}
                loading={loading}
                emptyMessage={selectedStation ? "No hay mediciones para esta estación" : "Seleccione una estación"}
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
          align-items: flex-end;
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
        .filter-select {
          padding: var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          font-size: 0.9rem;
          min-width: 200px;
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
        .date-input {
          padding: var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          font-size: 0.9rem;
          min-width: 160px;
          background: var(--bg-primary);
          color: var(--text-primary);
          transition: all var(--transition-base);
        }
        .date-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        .filter-actions {
          display: flex;
          gap: 0.5rem;
          align-items: flex-end;
        }
        .btn-secondary {
          padding: var(--spacing-md) var(--spacing-lg);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all var(--transition-base);
        }
        .btn-secondary:hover {
          background: var(--bg-tertiary);
          border-color: var(--text-secondary);
        }
      `}</style>
        </AdminLayout>
    );
};

export default MeasurementsPage;
