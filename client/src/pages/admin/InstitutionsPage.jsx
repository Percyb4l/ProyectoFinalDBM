/**
 * @fileoverview Institutions Management Page Component
 * 
 * Provides interface for managing institutions (organizations that own stations).
 * Features include listing institutions, creating new ones, and verifying institutions.
 * 
 * @module pages/admin/InstitutionsPage
 * @requires react
 */

import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import api from "../../services/api";

/**
 * InstitutionsPage Component
 * 
 * Manages institution records with create and verify operations.
 * Institutions can be customized with branding colors and logos.
 * 
 * @component
 * @returns {JSX.Element} Institution management interface
 */
const InstitutionsPage = () => {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        color_primary: "#6366f1",
        color_secondary: "#8b5cf6"
    });

    /**
     * Table column definitions
     * 
     * @type {Array<Object>}
     */
    const columns = [
        { key: "id", label: "ID", sortable: true },
        { key: "name", label: "Nombre", sortable: true },
        { key: "address", label: "Dirección", sortable: true },
        {
            key: "is_verified",
            label: "Verificada",
            sortable: true,
            // Render verification status badge
            render: (value) => (
                <span className={`status-badge ${value ? 'status-verified' : 'status-pending'}`}>
                    {value ? "✓ Verificada" : "Pendiente"}
                </span>
            )
        }
    ];

    /**
     * Effect: Load institutions on component mount
     */
    useEffect(() => {
        loadInstitutions();
    }, []);

    /**
     * Loads all institutions from the API
     * 
     * @async
     * @function loadInstitutions
     * @returns {Promise<void>}
     */
    const loadInstitutions = async () => {
        try {
            setLoading(true);
            const res = await api.get("/institutions");
            setInstitutions(res.data);
        } catch (error) {
            console.error("Error loading institutions:", error);
            alert("Error al cargar instituciones");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Verifies an institution
     * 
     * Marks an institution as verified, indicating it has been reviewed and approved.
     * 
     * @async
     * @param {Object} institution - Institution object to verify
     * @param {number} institution.id - Institution ID
     * @returns {Promise<void>}
     */
    const handleVerify = async (institution) => {
        try {
            await api.put(`/institutions/${institution.id}/verify`);
            // Optimistic update: mark as verified in local state
            setInstitutions(institutions.map(i =>
                i.id === institution.id ? { ...i, is_verified: true } : i
            ));
        } catch (error) {
            console.error("Error verifying institution:", error);
            alert("Error al verificar institución");
        }
    };

    /**
     * Handles form submission for creating a new institution
     * 
     * @async
     * @param {Event} e - Form submit event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/institutions", formData);
            setInstitutions([...institutions, res.data]);
            handleCloseModal();
        } catch (error) {
            console.error("Error creating institution:", error);
            alert("Error al crear institución");
        }
    };

    /**
     * Closes the modal and resets form state
     */
    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            name: "",
            address: "",
            color_primary: "#6366f1",
            color_secondary: "#8b5cf6"
        });
    };

    return (
        <AdminLayout>
            <div className="page-header">
                <h1>Gestión de Instituciones</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    + Nueva Institución
                </button>
            </div>

            <DataTable
                columns={columns}
                data={institutions}
                loading={loading}
                onEdit={handleVerify}
                emptyMessage="No hay instituciones registradas"
            />

            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title="Nueva Institución"
            >
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label>Nombre de la institución</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Dirección</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Color Primario</label>
                            <input
                                type="color"
                                value={formData.color_primary}
                                onChange={(e) => setFormData({ ...formData, color_primary: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Color Secundario</label>
                            <input
                                type="color"
                                value={formData.color_secondary}
                                onChange={(e) => setFormData({ ...formData, color_secondary: e.target.value })}
                            />
                        </div>
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
        .form-group input {
          padding: 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
        }
        .form-group input:focus {
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
        .status-verified {
          background: #d1fae5;
          color: #065f46;
        }
        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }
      `}</style>
        </AdminLayout>
    );
};

export default InstitutionsPage;
