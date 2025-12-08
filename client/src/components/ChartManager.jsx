/**
 * @fileoverview Chart Manager Component
 * 
 * Manages multiple measurement charts dynamically.
 * Allows users to add, remove, and configure multiple charts.
 * 
 * @module components/ChartManager
 * @requires react
 */

import React, { useState } from "react";
import MeasurementChart from "./MeasurementChart";
import "./ChartManager.css";

// Debug: Verify component is loaded
console.log("ChartManager component loaded");

/**
 * ChartManager Component
 * 
 * Manages a collection of measurement charts with the ability to add and remove them.
 * Each chart can display different station/variable combinations.
 * 
 * @component
 * @returns {JSX.Element} Chart manager interface with add/remove functionality
 */
const ChartManager = () => {
  const [charts, setCharts] = useState([
    { id: 1, stationId: "", variableId: "" }
  ]);

  // Debug: Log component render
  console.log("ChartManager renderizado con", charts.length, "gráficas");

  /**
   * Adds a new chart to the collection
   */
  const handleAddChart = () => {
    console.log("Agregando nueva gráfica");
    const newChart = {
      id: Date.now(), // Use timestamp as unique ID
      stationId: "",
      variableId: "",
    };
    setCharts([...charts, newChart]);
  };

  /**
   * Removes a chart from the collection
   * 
   * @param {number} chartId - ID of the chart to remove
   */
  const handleRemoveChart = (chartId) => {
    if (charts.length > 1) {
      setCharts(charts.filter((chart) => chart.id !== chartId));
    }
    // Don't show alert, just prevent removal if it's the last chart
  };

  /**
   * Updates the configuration of a specific chart
   * 
   * @param {number} chartId - ID of the chart to update
   * @param {string} stationId - Selected station ID
   * @param {string} variableId - Selected variable ID
   */
  const handleChartConfigChange = (chartId, stationId, variableId) => {
    setCharts(
      charts.map((chart) =>
        chart.id === chartId
          ? { ...chart, stationId, variableId }
          : chart
      )
    );
  };

  // Test: Add a very visible test element
  console.log("ChartManager está renderizando, charts:", charts);

  return (
    <div 
      className="chart-manager-container" 
      style={{ 
        width: '100%', 
        minHeight: '200px', 
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        position: 'relative',
        zIndex: 10,
        margin: '20px 0',
        border: '2px solid #4f46e5' // Test border to verify visibility
      }}
    >
      <div className="chart-manager-header" style={{ 
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <h3 className="chart-manager-title" style={{ 
          color: '#0f172a', 
          marginBottom: '10px',
          fontSize: '1.5rem',
          fontWeight: '700',
          display: 'block',
          visibility: 'visible'
        }}>
          Gráficas de Tendencias Históricas
        </h3>
        <button
          className="vrisa-btn-add-chart"
          onClick={handleAddChart}
          type="button"
          style={{
            padding: '12px 24px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: 'fit-content',
            minWidth: '180px',
            justifyContent: 'center'
          }}
        >
          <span style={{ fontSize: '20px', lineHeight: '1' }}>+</span>
          <span>Agregar Gráfica</span>
        </button>
      </div>

      <div className="charts-grid" style={{ 
        display: 'grid', 
        gap: '20px', 
        gridTemplateColumns: '1fr',
        width: '100%'
      }}>
        {charts.length === 0 && (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#666',
            fontSize: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '2px dashed #e2e8f0'
          }}>
            No hay gráficas. Haz clic en "Agregar Gráfica" para crear una.
          </div>
        )}
        {charts.map((chart, index) => (
          <div 
            key={chart.id} 
            className="chart-wrapper"
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <div className="chart-wrapper-header">
              <span className="chart-number">Gráfica {index + 1}</span>
              {charts.length > 1 && (
                <button
                  className="chart-remove-btn"
                  onClick={() => handleRemoveChart(chart.id)}
                  type="button"
                  aria-label="Eliminar gráfica"
                >
                  ×
                </button>
              )}
            </div>
            <MeasurementChart
              key={chart.id}
              chartId={chart.id}
              defaultStationId={chart.stationId}
              defaultVariableId={chart.variableId}
              onConfigChange={handleChartConfigChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartManager;

