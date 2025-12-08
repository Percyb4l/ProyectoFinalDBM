/**
 * @fileoverview Station Service
 * 
 * Service functions for making API calls related to station management.
 * Provides a clean interface for station CRUD operations.
 * 
 * @module services/stationService
 */

// src/services/stationService.js
import api from "./api";

/**
 * Retrieves all stations from the API
 * 
 * @returns {Promise<AxiosResponse>} Axios response containing stations array
 */
export const getStations = () => api.get("/stations");

/**
 * Creates a new station
 * 
 * @param {Object} data - Station data
 * @param {string} data.name - Station name
 * @param {number} data.latitude - Latitude coordinate
 * @param {number} data.longitude - Longitude coordinate
 * @param {string} [data.status] - Station status
 * @param {number} [data.institution_id] - Institution ID
 * @returns {Promise<AxiosResponse>} Axios response containing created station
 */
export const createStation = (data) => api.post("/stations", data);

/**
 * Updates an existing station
 * 
 * @param {number} id - Station ID to update
 * @param {Object} data - Updated station data
 * @returns {Promise<AxiosResponse>} Axios response containing updated station
 */
export const updateStation = (id, data) => api.put(`/stations/${id}`, data);

/**
 * Deletes a station
 * 
 * @param {number} id - Station ID to delete
 * @returns {Promise<AxiosResponse>} Axios response
 */
export const deleteStation = (id) => api.delete(`/stations/${id}`);
