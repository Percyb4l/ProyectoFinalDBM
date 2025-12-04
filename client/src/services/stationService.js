// src/services/stationService.js
import api from "./api";

// Estaciones
export const getStations = () => api.get("/stations");
export const createStation = (data) => api.post("/stations", data);
export const updateStation = (id, data) => api.put(`/stations/${id}`, data);
export const deleteStation = (id) => api.delete(`/stations/${id}`);
