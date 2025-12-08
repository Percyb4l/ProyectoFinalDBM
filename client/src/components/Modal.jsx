/**
 * @fileoverview Modal Component
 * 
 * A reusable modal dialog component with backdrop and close functionality.
 * Supports different sizes and can contain any child content.
 * 
 * @module components/Modal
 * @requires react
 */

import React from "react";
import "./Modal.css";

/**
 * Modal Component
 * 
 * Displays a modal dialog overlay with a centered card containing title and content.
 * Clicking the backdrop or close button triggers the onClose callback.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback function when modal should close
 * @param {string} props.title - Modal title text
 * @param {React.ReactNode} props.children - Content to display in modal body
 * @param {string} [props.size="medium"] - Modal size: 'small', 'medium', or 'large'
 * 
 * @component
 * @returns {JSX.Element|null} Rendered modal or null if not open
 * 
 * @example
 * <Modal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Edit Station"
 *   size="large"
 * >
 *   <form>...</form>
 * </Modal>
 */
const Modal = ({ isOpen, onClose, title, children, size = "medium" }) => {
    // Don't render anything if modal is closed
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className={`modal-card modal-${size}`}
                // Prevent backdrop click from closing when clicking inside modal
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
