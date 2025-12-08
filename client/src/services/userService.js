/**
 * @fileoverview User Service
 * 
 * Service functions for making API calls related to user management.
 * Provides a clean interface for user CRUD operations.
 * 
 * @module services/userService
 */

import api from "./api";

/**
 * Retrieves all users from the API
 * 
 * @returns {Promise<AxiosResponse>} Axios response containing users array
 */
export const getUsers = () => api.get("/users");

/**
 * Creates a new user
 * 
 * @param {Object} data - User data
 * @param {string} data.name - User name
 * @param {string} data.email - User email
 * @param {string} data.password - User password
 * @param {string} data.role - User role
 * @returns {Promise<AxiosResponse>} Axios response containing created user
 */
export const createUser = (data) => api.post("/users", data);

/**
 * Updates an existing user
 * 
 * @param {number} id - User ID to update
 * @param {Object} data - Updated user data
 * @returns {Promise<AxiosResponse>} Axios response containing updated user
 */
export const updateUser = (id, data) => api.put(`/users/${id}`, data);

/**
 * Deletes a user
 * 
 * @param {number} id - User ID to delete
 * @returns {Promise<AxiosResponse>} Axios response
 */
export const deleteUser = (id) => api.delete(`/users/${id}`);
