import api from "./api";

// Obtener datos del usuario actual
export const getProfile = () => api.get("/auth/me");

// Actualizar datos del usuario
export const updateProfile = (data) => api.put("/auth/update", data);

// Actualizar contraseña
export const changePassword = (data) =>
  api.put("/auth/change-password", data);

// Obtener info de institución
export const getInstitution = (id) =>
  api.get(`/institutions/${id}`);

// Actualizar colores/logo de institución
export const updateInstitution = (id, data) =>
  api.put(`/institutions/${id}`, data);
