/**
 * @fileoverview Settings Service
 * 
 * Service functions for making API calls related to user and institution settings.
 * Handles profile management, password changes, and institution customization.
 * 
 * @module services/settingsService
 */

import api from "./api";

/**
 * Retrieves the current user's profile information
 * 
 * @returns {Promise<AxiosResponse>} Axios response containing user profile data
 */
export const getProfile = () => api.get("/auth/me");

/**
 * Updates the current user's profile information
 * 
 * @param {Object} data - Updated profile data
 * @param {string} [data.name] - Updated user name
 * @param {string} [data.email] - Updated email address
 * @returns {Promise<AxiosResponse>} Axios response containing updated user data
 */
export const updateProfile = (data) => api.put("/auth/update", data);

/**
 * Changes the current user's password
 * 
 * @param {Object} data - Password change data
 * @param {string} data.currentPassword - Current password
 * @param {string} data.newPassword - New password
 * @returns {Promise<AxiosResponse>} Axios response
 */
export const changePassword = (data) =>
  api.put("/auth/change-password", data);

/**
 * Retrieves institution information by ID
 * 
 * @param {number} id - Institution ID
 * @returns {Promise<AxiosResponse>} Axios response containing institution data
 */
export const getInstitution = (id) =>
  api.get(`/institutions/${id}`);

/**
 * Updates institution settings (colors, logo, etc.)
 * 
 * @param {number} id - Institution ID to update
 * @param {Object} data - Updated institution data
 * @param {string} [data.color_primary] - Updated primary color
 * @param {string} [data.color_secondary] - Updated secondary color
 * @param {string} [data.logo_url] - Updated logo URL
 * @returns {Promise<AxiosResponse>} Axios response containing updated institution
 */
export const updateInstitution = (id, data) =>
  api.put(`/institutions/${id}`, data);
