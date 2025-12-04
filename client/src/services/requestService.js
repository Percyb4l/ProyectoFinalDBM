import api from "./api";

// Solicitudes generales (mantenimiento + integraciones)
export const getAllRequests = () => api.get("/requests");

// Para aprobar/rechazar mantenimiento
export const completeMaintenance = (id) => api.put(`/maintenance/${id}/complete`);

export const approveIntegration = (id) => api.put(`/integrations/${id}/approve`);
export const rejectIntegration = (id) => api.put(`/integrations/${id}/reject`);
