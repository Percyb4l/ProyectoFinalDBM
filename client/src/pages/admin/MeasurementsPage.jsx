import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const MeasurementsPage = () => {
    const [measurements, setMeasurements] = useState([]);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStation, setSelectedStation] = useState("");

    const columns = [
        { key: "id", label: "ID", sortable: true },
        { key: "station_id", label: "Estación", sortable: true },
        { key: "sensor_id", label: "Sensor", sortable: true },
        { key: "variable_id", label: "Variable", sortable: true },
        {
            key: "value",
            label: "Valor",
            sortable: true,
            render: (value, row) => `${value} ${getUnit(row.variable_id)}`
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
    }, []);

    useEffect(() => {
        if (selectedStation) {
            loadMeasurements(selectedStation);
        } else {
            setMeasurements([]);
        }
    }, [selectedStation]);

    const loadStations = async () => {
        try {
            const res = await api.get("/stations");
            setStations(res.data);
        } catch (error) {
            console.error("Error loading stations:", error);
        }
    };

    const loadMeasurements = async (stationId) => {
        try {
            setLoading(true);
            const res = await api.get(`/measurements/station/${stationId}`);
            setMeasurements(res.data);
        } catch (error) {
            console.error("Error loading measurements:", error);
            setMeasurements([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="page-header">
                <h1>Mediciones</h1>
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
      `}</style>
        </AdminLayout>
    );
};

export default MeasurementsPage;
