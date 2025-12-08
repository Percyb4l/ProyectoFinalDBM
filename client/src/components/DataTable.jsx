/**
 * @fileoverview Data Table Component
 * 
 * A reusable table component with sorting, loading states, and action buttons.
 * Displays tabular data with customizable columns and optional edit/delete actions.
 * 
 * @module components/DataTable
 * @requires react
 */

import React, { useState } from "react";
import "./DataTable.css";

/**
 * DataTable Component
 * 
 * Displays data in a sortable table format with optional edit and delete actions.
 * Supports custom column rendering and handles empty/loading states gracefully.
 * 
 * @param {Object} props - Component props
 * @param {Array<Object>} props.columns - Column definitions
 * @param {string} props.columns[].key - Field name in data objects
 * @param {string} props.columns[].label - Column header text
 * @param {boolean} [props.columns[].sortable=true] - Whether column is sortable
 * @param {Function} [props.columns[].render] - Custom render function(value, row) => JSX
 * @param {Array<Object>} props.data - Array of data objects to display
 * @param {boolean} [props.loading=false] - Whether data is currently loading
 * @param {Function} [props.onEdit] - Callback when edit button is clicked (row) => void
 * @param {Function} [props.onDelete] - Callback when delete button is clicked (row) => void
 * @param {string} [props.emptyMessage="No hay datos disponibles"] - Message when no data
 * 
 * @component
 * @returns {JSX.Element} Rendered data table
 * 
 * @example
 * <DataTable
 *   columns={[
 *     { key: "name", label: "Name", sortable: true },
 *     { key: "status", label: "Status", render: (val) => <Badge>{val}</Badge> }
 *   ]}
 *   data={stations}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 */
const DataTable = ({
    columns,
    data,
    loading = false,
    onEdit,
    onDelete,
    emptyMessage = "No hay datos disponibles"
}) => {
    // Sort state - tracks which column is sorted and direction
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");

    /**
     * Handles column header click for sorting
     * 
     * Toggles sort direction if clicking the same column, or sets new sort column.
     * 
     * @param {string} columnKey - Key of the column to sort by
     */
    const handleSort = (columnKey) => {
        if (sortColumn === columnKey) {
            // Toggle direction if same column clicked
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // New column - start with ascending
            setSortColumn(columnKey);
            setSortDirection("asc");
        }
    };

    /**
     * Memoized sorted data
     * 
     * Sorts data array based on current sort column and direction.
     * Returns original data if no sort column is selected.
     * 
     * @type {Array}
     */
    const sortedData = React.useMemo(() => {
        if (!sortColumn) return data;

        // Create copy to avoid mutating original array
        return [...data].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];

            // Equal values - no change in order
            if (aVal === bVal) return 0;

            // Compare values and apply sort direction
            const comparison = aVal > bVal ? 1 : -1;
            return sortDirection === "asc" ? comparison : -comparison;
        });
    }, [data, sortColumn, sortDirection]);

    // Show loading state
    if (loading) {
        return <div className="table-loading">Cargando datos...</div>;
    }

    // Show empty state
    if (!data || data.length === 0) {
        return <div className="table-empty">{emptyMessage}</div>;
    }

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                // Only make sortable if explicitly not disabled
                                onClick={() => col.sortable !== false && handleSort(col.key)}
                                className={col.sortable !== false ? "sortable" : ""}
                            >
                                {col.label}
                                {/* Show sort indicator for active sort column */}
                                {sortColumn === col.key && (
                                    <span className="sort-indicator">
                                        {sortDirection === "asc" ? " ↑" : " ↓"}
                                    </span>
                                )}
                            </th>
                        ))}
                        {/* Show actions column if edit or delete handlers provided */}
                        {(onEdit || onDelete) && <th className="actions-column">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, index) => (
                        <tr key={row.id || index}>
                            {columns.map((col) => (
                                <td key={col.key}>
                                    {/* Use custom render function if provided, otherwise display raw value */}
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                            {/* Action buttons column */}
                            {(onEdit || onDelete) && (
                                <td className="actions-cell">
                                    {onEdit && (
                                        <button
                                            className="btn-action btn-edit"
                                            onClick={() => onEdit(row)}
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            className="btn-action btn-delete"
                                            onClick={() => onDelete(row)}
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
