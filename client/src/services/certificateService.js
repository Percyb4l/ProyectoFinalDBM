/**
 * @fileoverview Certificate Service
 * 
 * Service functions for making API calls related to certificate management.
 * Handles file uploads for calibration and maintenance certificates.
 * 
 * @module services/certificateService
 */

import api from "./api";

/**
 * Uploads a certificate file for a station
 * 
 * @param {FormData} formData - FormData object containing:
 *   - certificate: (File) PDF or image file
 *   - station_id: (number) Station ID
 *   - sensor_id: (number, optional) Sensor ID
 *   - type: (string) 'calibracion' or 'mantenimiento'
 *   - expiration_date: (string, optional) ISO date format (YYYY-MM-DD)
 * @returns {Promise<AxiosResponse>} Axios response containing created certificate
 */
export const uploadCertificate = (formData) => {
  return api.post("/certificates", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Retrieves all certificates for a specific station
 * 
 * @param {number} stationId - Station ID
 * @param {string} [type] - Optional filter: 'calibracion' or 'mantenimiento'
 * @returns {Promise<AxiosResponse>} Axios response containing certificates array
 */
export const getCertificatesByStation = (stationId, type = null) => {
  const params = type ? { type } : {};
  return api.get(`/certificates/station/${stationId}`, { params });
};

/**
 * Retrieves a single certificate by ID
 * 
 * @param {number} certificateId - Certificate ID
 * @returns {Promise<AxiosResponse>} Axios response containing certificate object
 */
export const getCertificateById = (certificateId) => {
  return api.get(`/certificates/${certificateId}`);
};

/**
 * Deletes a certificate
 * 
 * @param {number} certificateId - Certificate ID to delete
 * @returns {Promise<AxiosResponse>} Axios response
 */
export const deleteCertificate = (certificateId) => {
  return api.delete(`/certificates/${certificateId}`);
};

