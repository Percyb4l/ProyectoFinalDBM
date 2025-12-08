/**
 * @fileoverview Request Service
 * 
 * Service functions for making API calls related to maintenance and integration requests.
 * Handles approval/rejection workflows for various request types.
 * 
 * @module services/requestService
 */

import api from "./api";

/**
 * Retrieves all requests (maintenance + integration) from the API
 * 
 * @returns {Promise<AxiosResponse>} Axios response containing requests array
 */
export const getAllRequests = () => api.get("/requests");

/**
 * Marks a maintenance request as completed
 * 
 * @param {number} id - Maintenance request ID to complete
 * @returns {Promise<AxiosResponse>} Axios response containing updated request
 */
export const completeMaintenance = (id) => api.put(`/maintenance/${id}/complete`);

/**
 * Approves an integration request
 * 
 * @param {number} id - Integration request ID to approve
 * @returns {Promise<AxiosResponse>} Axios response containing updated request
 */
export const approveIntegration = (id) => api.put(`/integrations/${id}/approve`);

/**
 * Rejects an integration request
 * 
 * @param {number} id - Integration request ID to reject
 * @returns {Promise<AxiosResponse>} Axios response containing updated request
 */
export const rejectIntegration = (id) => api.put(`/integrations/${id}/reject`);
