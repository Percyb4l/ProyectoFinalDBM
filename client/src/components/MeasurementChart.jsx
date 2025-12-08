/**
 * @fileoverview Measurement Chart Component
 * 
 * Reusable component for displaying historical measurement data as a line chart.
 * Uses Recharts library for visualization with responsive design and interactive features.
 * 
 * @module components/MeasurementChart
 * @requires react
 * @requires recharts
 */

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import api from "../services/api";
import "./MeasurementChart.css";

/**
 * Custom tooltip component for the chart
 * 
 * Displays formatted date, value, and unit when hovering over data points.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const date = new Date(data.date);
    const formattedDate = date.toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="chart-tooltip">
        <p className="tooltip-date">{formattedDate}</p>
        <p className="tooltip-value">
          {data.value.toFixed(2)} {data.unit}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Formats date for X-axis display
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
const formatXAxisDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("es-ES", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
  });
};

/**
 * MeasurementChart Component
 * 
 * Displays historical measurement data as an interactive line chart.
 * Includes dropdowns for selecting station and variable, and shows
 * reference lines for critical thresholds.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number} [props.chartId] - Unique ID for this chart instance
 * @param {string} [props.defaultStationId] - Default station ID to select
 * @param {string} [props.defaultVariableId] - Default variable ID to select
 * @param {Function} [props.onConfigChange] - Callback when chart configuration changes
 * @returns {JSX.Element} Chart component with controls
 */
const MeasurementChart = ({
  chartId,
  defaultStationId = "",
  defaultVariableId = "",
  onConfigChange,
}) => {
  const [stations, setStations] = useState([]);
  const [variables, setVariables] = useState([]);
  const [selectedStation, setSelectedStation] = useState(defaultStationId);
  const [selectedVariable, setSelectedVariable] = useState(defaultVariableId);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [criticalThreshold, setCriticalThreshold] = useState(null);
  const [unit, setUnit] = useState("");

  /**
   * Sync default values when they change
   */
  useEffect(() => {
    if (defaultStationId && defaultStationId !== selectedStation) {
      setSelectedStation(defaultStationId);
    }
    if (defaultVariableId && defaultVariableId !== selectedVariable) {
      setSelectedVariable(defaultVariableId);
    }
  }, [defaultStationId, defaultVariableId]);

  /**
   * Loads all stations from the API
   */
  useEffect(() => {
    const loadStations = async () => {
      try {
        const res = await api.get("/stations");
        const stationsData = res.data || [];
        setStations(stationsData);
        // Auto-select first station if available and no default provided
        if (stationsData.length > 0 && !defaultStationId) {
          const firstStationId = stationsData[0].id.toString();
          setSelectedStation(firstStationId);
          if (onConfigChange && chartId) {
            onConfigChange(chartId, firstStationId, selectedVariable);
          }
          console.log("Estación seleccionada automáticamente:", firstStationId);
        } else if (defaultStationId) {
          setSelectedStation(defaultStationId);
        } else {
          console.warn("No hay estaciones disponibles");
        }
      } catch (err) {
        console.error("Error loading stations:", err);
        setError("Error al cargar las estaciones");
      }
    };

    loadStations();
  }, []);

  /**
   * Loads all variables from the API
   */
  useEffect(() => {
    const loadVariables = async () => {
      try {
        const res = await api.get("/variables");
        const variablesData = res.data || [];
        setVariables(variablesData);
        // Auto-select first variable if available and no default provided
        if (variablesData.length > 0 && !defaultVariableId) {
          const firstVariableId = variablesData[0].id;
          setSelectedVariable(firstVariableId);
          if (onConfigChange && chartId) {
            onConfigChange(chartId, selectedStation, firstVariableId);
          }
          console.log("Variable seleccionada automáticamente:", firstVariableId);
        } else if (defaultVariableId) {
          setSelectedVariable(defaultVariableId);
        } else {
          console.warn("No hay variables disponibles");
        }
      } catch (err) {
        console.error("Error loading variables:", err);
        setError("Error al cargar las variables");
      }
    };

    loadVariables();
  }, []);

  /**
   * Loads measurement history data for the selected station and variable
   */
  const loadMeasurementHistory = async () => {
    if (!selectedStation || !selectedVariable) {
      console.log("Esperando selección de estación y variable...");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Cargando historial:", { station_id: selectedStation, variable_id: selectedVariable });
      const res = await api.get("/measurements/history", {
        params: {
          station_id: selectedStation,
          variable_id: selectedVariable,
          days: 7, // Last 7 days by default
        },
      });

      console.log("Datos recibidos:", res.data?.length || 0, "mediciones");

      if (res.data && res.data.length > 0) {
        setChartData(res.data);
        // Extract unit from first data point
        setUnit(res.data[0].unit || "");
        console.log("Gráfica actualizada con", res.data.length, "puntos de datos");
      } else {
        setChartData([]);
        setUnit("");
        console.log("No hay datos para mostrar");
      }
    } catch (err) {
      console.error("Error loading measurement history:", err);
      console.error("Error details:", err.response?.data || err.message);
      setError(`Error al cargar los datos históricos: ${err.response?.data?.error || err.message}`);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loads critical threshold for the selected variable
   */
  const loadThreshold = async () => {
    if (!selectedVariable) return;

    try {
      const res = await api.get("/thresholds");
      const threshold = res.data.find((t) => t.variable_id === selectedVariable);
      if (threshold && threshold.critical !== null) {
        setCriticalThreshold(threshold.critical);
      } else {
        setCriticalThreshold(null);
      }
    } catch (err) {
      console.error("Error loading threshold:", err);
      setCriticalThreshold(null);
    }
  };

  /**
   * Loads measurement history when station or variable changes
   */
  useEffect(() => {
    if (selectedStation && selectedVariable) {
      loadMeasurementHistory();
      loadThreshold();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStation, selectedVariable]);

  /**
   * Gets the display name for the selected variable
   */
  const getVariableName = () => {
    const variable = variables.find((v) => v.id === selectedVariable);
    return variable ? variable.name : selectedVariable;
  };

  /**
   * Gets the display name for the selected station
   */
  const getStationName = () => {
    const station = stations.find((s) => s.id.toString() === selectedStation);
    return station ? station.name : "Estación";
  };

  // Debug: Log current state
  console.log("MeasurementChart render:", {
    stations: stations.length,
    variables: variables.length,
    selectedStation,
    selectedVariable,
    chartData: chartData.length,
    loading,
    error,
  });

  return (
    <div className="measurement-chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Tendencias Históricas</h3>
        <div className="chart-controls">
          <div className="chart-control-group">
            <label htmlFor="station-select">Estación:</label>
            <select
              id={`station-select-${chartId || 'default'}`}
              className="chart-select"
              value={selectedStation}
              onChange={(e) => {
                const newStationId = e.target.value;
                setSelectedStation(newStationId);
                if (onConfigChange && chartId) {
                  onConfigChange(chartId, newStationId, selectedVariable);
                }
              }}
            >
              <option value="">Seleccionar estación</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          <div className="chart-control-group">
            <label htmlFor="variable-select">Variable:</label>
            <select
              id={`variable-select-${chartId || 'default'}`}
              className="chart-select"
              value={selectedVariable}
              onChange={(e) => {
                const newVariableId = e.target.value;
                setSelectedVariable(newVariableId);
                if (onConfigChange && chartId) {
                  onConfigChange(chartId, selectedStation, newVariableId);
                }
              }}
            >
              <option value="">Seleccionar variable</option>
              {variables.map((variable) => (
                <option key={variable.id} value={variable.id}>
                  {variable.name} ({variable.unit})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="chart-content">
        {loading ? (
          <div className="chart-loading">Cargando datos...</div>
        ) : error ? (
          <div className="chart-error">{error}</div>
        ) : chartData.length === 0 ? (
          <div className="chart-empty">
            {selectedStation && selectedVariable
              ? "No hay datos disponibles para los últimos 7 días"
              : "Selecciona una estación y una variable para ver los datos"}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxisDate}
                angle={-45}
                textAnchor="end"
                height={80}
                stroke="#666"
              />
              <YAxis
                label={{
                  value: unit ? `Valor (${unit})` : "Valor",
                  angle: -90,
                  position: "insideLeft",
                }}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={() => `${getVariableName()} (${getStationName()})`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                name="Medición"
              />
              {criticalThreshold !== null && (
                <ReferenceLine
                  y={criticalThreshold}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label={{
                    value: `Umbral Crítico: ${criticalThreshold} ${unit}`,
                    position: "topRight",
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MeasurementChart;

