/**
 * @fileoverview Alert Controller
 * 
 * This module handles HTTP requests related to environmental alerts.
 * Alerts are generated when measurement values exceed defined thresholds
 * or when system anomalies are detected.
 * 
 * @module controllers/alertController
 */

import pool from "../config/db.js";

/**
 * Creates a new environmental alert
 * 
 * Records an alert for a specific station and variable when threshold violations
 * or other issues are detected. Alerts can have different severity levels.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Alert data
 * @param {number} req.body.station_id - ID of the station where alert occurred
 * @param {string} req.body.variable_id - ID of the variable that triggered the alert
 * @param {string} req.body.message - Alert message describing the issue
 * @param {string} req.body.severity - Alert severity: 'low', 'medium', 'high', or 'critical'
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends HTTP 201 with created alert object including auto-generated timestamp
 * 
 * @throws {Error} Forwards database constraint violations and errors to error handling middleware
 * 
 * @example
 * POST /api/alerts
 * {
 *   "station_id": 1,
 *   "variable_id": "PM25",
 *   "message": "PM2.5 levels exceeded safe threshold",
 *   "severity": "high"
 * }
 */
export const createAlert = async (req, res, next) => {
  try {
    const { station_id, variable_id, message, severity } = req.body;

    const query = `
      INSERT INTO alerts (station_id, variable_id, message, severity)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(query, [
      station_id,
      variable_id,
      message,
      severity,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all alerts from the database
 * 
 * Returns all alerts ordered by ID descending (most recent first).
 * Includes both resolved and unresolved alerts.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON array of alert objects
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * GET /api/alerts
 */
export const getAlerts = async (req, res, next) => {
  try {
    // Order by ID DESC to show most recent alerts first
    const result = await pool.query("SELECT * FROM alerts ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Marks an alert as resolved
 * 
 * Updates an alert's status to resolved and records the resolution timestamp.
 * This is used when an administrator has addressed the alert condition.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {number} req.params.id - Alert ID to resolve
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON object with updated alert data including resolved_at timestamp
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * PUT /api/alerts/1/resolve
 */
export const resolveAlert = async (req, res, next) => {
  try {
    const query = `
      UPDATE alerts
      SET is_resolved = TRUE, resolved_at = NOW()
      WHERE id = $1 RETURNING *
    `;

    const result = await pool.query(query, [req.params.id]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
