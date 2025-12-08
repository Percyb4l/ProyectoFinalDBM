/**
 * @fileoverview Measurements Viewing Page Component
 * 
 * This component provides an interface for viewing and filtering environmental measurements.
 * Features include station selection, date range filtering, variable type filtering,
 * and formatted display of measurement data with units.
 * 
 * @module pages/admin/MeasurementsPage
 * @requires react
 */

import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

/**
 * MeasurementsPage Component
 * 
 * Displays environmental measurements with advanced filtering capabilities:
 * - Station-based filtering (required)
 * - Date range selection (start and end dates)
 * - Variable type filtering (e.g., PM2.5, O3, NO2)
 * - Quick filter for last 7 days
 * - Formatted display with proper units
 * 
 * @component
 * @returns {JSX.Element} Rendered measurements viewing interface
 */
const MeasurementsPage = () => {
    // Data state
    const [measurements, setMeasurements] = useState([]);
    const [stations, setStations] = useState([]);
    const [variables, setVariables] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Filter state - changes trigger automatic reload
    const [selectedStation, setSelectedStation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedVariable, setSelectedVariable] = useState("");

    /**
     * Table column definitions for DataTable component
     * 
     * Defines measurement fields to display with custom formatting for values and timestamps.
     * The value column includes unit information from the API or fallback mapping.
     * 
     * @type {Array<Object>}
     */
    const columns = [
        { key: "id", label: "ID", sortable: true },
        { key: "station_id", label: "Estación", sortable: true },
        { key: "sensor_id", label: "Sensor", sortable: true },
        { key: "variable_id", label: "Variable", sortable: true },
        {
            key: "value",
            label: "Valor",
            sortable: true,
            // Format value with unit - prefer API unit, fallback to hardcoded mapping
            render: (value, row) => `${value} ${row.unit || getUnit(row.variable_id)}`
        },
        {
            key: "variable_name",
            label: "Variable",
            sortable: true,
            // Display variable name if available, otherwise show variable_id
            render: (value, row) => value || row.variable_id
        },
        {
            key: "timestamp",
            label: "Fecha/Hora",
            sortable: true,
            // Format timestamp to Spanish locale string
            render: (value) => new Date(value).toLocaleString('es-ES')
        }
    ];

    /**
     * Maps variable IDs to their default units
     * 
     * Provides fallback unit mapping when API doesn't return unit information.
     * This ensures measurements always display with appropriate units.
     * 
     * @param {string} variableId - Variable identifier (e.g., 'PM25', 'O3', 'NO2')
     * @returns {string} Unit string for the variable, empty string if unknown
     */
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

    /**
     * Initial data loading effect
     * 
     * Loads stations and variables when component mounts.
     * These are needed for filter dropdowns.
     */
    useEffect(() => {
        loadStations();
        loadVariables();
    }, []);

    /**
     * Filter change effect
     * 
     * Automatically reloads measurements when station, date range, or variable filter changes.
     * Clears measurements if no station is selected.
     */
    useEffect(() => {
        if (selectedStation) {
            loadMeasurements(selectedStation);
        } else {
            // Clear measurements when no station selected
            setMeasurements([]);
        }
    }, [selectedStation, startDate, endDate, selectedVariable]);

    /**
     * Loads all stations from the API
     * 
     * Fetches station list for the station filter dropdown.
     * Errors are logged but don't block the UI.
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
     * Loads all environmental variables from the API
     * 
     * Fetches variable list for the variable filter dropdown.
     * Variables define measurement types (e.g., PM2.5, O3, temperature).
     * 
     * @async
     * @function loadVariables
     * @returns {Promise<void>}
     */
    const loadVariables = async () => {
        try {
            const res = await api.get("/variables");
            setVariables(res.data);
        } catch (error) {
            console.error("Error loading variables:", error);
        }
    };

    /**
     * Loads measurements for a specific station with optional filters
     * 
     * Constructs API request with query parameters for date range and variable filtering.
     * Results are ordered by timestamp descending (most recent first).
     * 
     * @async
     * @param {string|number} stationId - ID of the station to load measurements for
     * @returns {Promise<void>}
     */
    const loadMeasurements = async (stationId) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            
            // Build query parameters only for non-empty filter values
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            if (selectedVariable) params.append("variable_id", selectedVariable);
            
            const queryString = params.toString();
            const url = `/measurements/station/${stationId}${queryString ? `?${queryString}` : ""}`;
            const res = await api.get(url);
            setMeasurements(res.data);
        } catch (error) {
            console.error("Error loading measurements:", error);
            // Clear measurements on error to show empty state
            setMeasurements([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Clears all date and variable filters
     * 
     * Resets filter state to empty values, which triggers automatic reload
     * with only the station filter applied.
     */
    const handleClearFilters = () => {
        setStartDate("");
        setEndDate("");
        setSelectedVariable("");
    };

    /**
     * Gets today's date in ISO format (YYYY-MM-DD)
     * 
     * Used as maximum date for date inputs to prevent selecting future dates.
     * 
     * @returns {string} Today's date in ISO format
     */
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    /**
     * Gets date from 7 days ago in ISO format (YYYY-MM-DD)
     * 
     * Used for the "Last 7 days" quick filter button.
     * 
     * @returns {string} Date from 7 days ago in ISO format
     */
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
                        // Prevent selecting dates after end date or in the future
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
                        // Prevent selecting dates before start date or in the future
                        min={startDate}
                        max={getTodayDate()}
                        className="date-input"
                    />
                </div>

                <div className="filter-actions">
                    <button
                        className="btn-secondary"
                        onClick={() => {
                            // Quick filter: set date range to last 7 days
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
