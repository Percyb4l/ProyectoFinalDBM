/**
 * @fileoverview Report Service
 * 
 * Service functions for making API calls related to report management.
 * Provides interface for retrieving, generating, and downloading reports.
 * 
 * @module services/reportService
 */

import api from "./api";

/**
 * Retrieves all reports from the API
 * 
 * @returns {Promise<AxiosResponse>} Axios response containing reports array
 */
export const getReports = () => api.get("/reports");

/**
 * Generates a new report
 * 
 * @param {Object} data - Report generation data
 * @param {number} [data.generated_by] - User ID who generated the report
 * @param {string} data.title - Report title
 * @param {string} [data.description] - Report description
 * @param {string} [data.report_type] - Type of report
 * @returns {Promise<AxiosResponse>} Axios response containing created report
 */
export const generateReport = (data) =>
  api.post("/reports", data);

/**
 * Downloads a report file
 * 
 * @param {string} path - File path of the report to download
 * @returns {Promise<AxiosResponse>} Axios response with blob data
 */
export const downloadReport = (path) =>
  api.get(`/reports/download?file=${path}`, { responseType: "blob" });
