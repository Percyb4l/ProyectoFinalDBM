/**
 * @fileoverview Report Controller
 * 
 * This module handles HTTP requests related to report generation and management.
 * Reports are generated documents containing analysis of environmental data,
 * station performance, or system statistics.
 * 
 * @module controllers/reportController
 */

import pool from "../config/db.js";

/**
 * Creates a new report record
 * 
 * Records metadata for a generated report. The actual report content may be
 * stored separately or generated on-demand. Reports track who generated them
 * and when for audit purposes.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Report data
 * @param {number} [req.body.generated_by] - ID of the user who generated the report
 * @param {string} req.body.title - Report title
 * @param {string} [req.body.description] - Report description or summary
 * @param {string} [req.body.report_type] - Type/category of report (e.g., 'monthly', 'station_performance')
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends HTTP 201 with created report object including auto-generated timestamp
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * POST /api/reports
 * {
 *   "generated_by": 1,
 *   "title": "Monthly Air Quality Report",
 *   "description": "Summary of air quality measurements for January 2024",
 *   "report_type": "monthly"
 * }
 */
export const createReport = async (req, res, next) => {
  try {
    const { generated_by, title, description, report_type } = req.body;

    const query = `
      INSERT INTO reports (generated_by, title, description, report_type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(query, [
      generated_by,
      title,
      description,
      report_type,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all reports from the database
 * 
 * Returns all report records ordered by ID descending (most recent first).
 * Used for displaying report history and allowing users to access past reports.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON array of report objects
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * GET /api/reports
 */
export const getReports = async (req, res, next) => {
  try {
    // Order by ID DESC to show most recent reports first
    const result = await pool.query("SELECT * FROM reports ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};
