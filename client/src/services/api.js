/**
 * @fileoverview API Service Configuration
 * 
 * This module configures the Axios HTTP client for making API requests to the backend.
 * Includes automatic JWT token injection for authenticated requests.
 * 
 * @module services/api
 */

// src/services/api.js
import axios from "axios";

/**
 * Axios instance configured for API requests
 * 
 * Base URL is set to '/api' which will be proxied to the backend server
 * by the Vite development server or production reverse proxy.
 * 
 * @type {axios.AxiosInstance}
 */
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor for automatic JWT token injection
 * 
 * Automatically adds the JWT token from localStorage to the Authorization header
 * of all requests if a token exists. This ensures authenticated requests work
 * seamlessly without manually adding tokens to each request.
 * 
 * @param {Object} config - Axios request configuration object
 * @param {Object} config.headers - Request headers object
 * @returns {Object} Modified request configuration with Authorization header
 */
api.interceptors.request.use(
  (config) => {
    // Retrieve JWT token from browser localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Add Bearer token to Authorization header
      // Format: "Bearer <token>"
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Default export of configured Axios instance
 * 
 * Use this instance for all API calls throughout the application.
 * 
 * @example
 * import api from './services/api';
 * const response = await api.get('/stations');
 */
export default api;
