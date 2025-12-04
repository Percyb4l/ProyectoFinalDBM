import React, { useState } from "react";
import "./DataTable.css";

const DataTable = ({
    columns,
    data,
    loading = false,
    onEdit,
    onDelete,
    emptyMessage = "No hay datos disponibles"
}) => {
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");

    const handleSort = (columnKey) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnKey);
            setSortDirection("asc");
        }
    };

    const sortedData = React.useMemo(() => {
        if (!sortColumn) return data;

        return [...data].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];

            if (aVal === bVal) return 0;

            const comparison = aVal > bVal ? 1 : -1;
            return sortDirection === "asc" ? comparison : -comparison;
        });
    }, [data, sortColumn, sortDirection]);

    if (loading) {
        return <div className="table-loading">Cargando datos...</div>;
    }

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
                                onClick={() => col.sortable !== false && handleSort(col.key)}
                                className={col.sortable !== false ? "sortable" : ""}
                            >
                                {col.label}
                                {sortColumn === col.key && (
                                    <span className="sort-indicator">
                                        {sortDirection === "asc" ? " ↑" : " ↓"}
                                    </span>
                                )}
                            </th>
                        ))}
                        {(onEdit || onDelete) && <th className="actions-column">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, index) => (
                        <tr key={row.id || index}>
                            {columns.map((col) => (
                                <td key={col.key}>
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
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
