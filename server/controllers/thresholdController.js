/**
 * @fileoverview Threshold Controller
 * 
 * This module handles HTTP requests related to environmental variable thresholds.
 * Thresholds define safe/unsafe ranges for measurement values and are used to
 * trigger alerts when values exceed acceptable levels.
 * 
 * @module controllers/thresholdController
 */

import pool from "../config/db.js";

/**
 * Creates a new threshold definition for an environmental variable
 * 
 * Defines alert thresholds for a specific variable type. Thresholds are used
 * to automatically generate alerts when measurements exceed safe levels.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Threshold data
 * @param {string} req.body.variable_id - ID of the variable these thresholds apply to
 * @param {number} [req.body.low] - Low threshold value (warning level)
 * @param {number} [req.body.medium] - Medium threshold value (moderate concern)
 * @param {number} [req.body.high] - High threshold value (serious concern)
 * @param {number} [req.body.critical] - Critical threshold value (dangerous level)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends HTTP 201 with created threshold object
 * 
 * @throws {Error} Forwards database constraint violations and errors to error handling middleware
 * 
 * @example
 * POST /api/thresholds
 * {
 *   "variable_id": "PM25",
 *   "low": 12,
 *   "medium": 35,
 *   "high": 55,
 *   "critical": 150
 * }
 */
export const createThreshold = async (req, res, next) => {
  try {
    const { variable_id, low, medium, high, critical } = req.body;

    const query = `
      INSERT INTO thresholds (variable_id, low, medium, high, critical)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(query, [
      variable_id,
      low,
      medium,
      high,
      critical,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all threshold definitions from the database
 * 
 * Returns all threshold configurations for all environmental variables.
 * Used to display and manage alert threshold settings.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON array of threshold objects
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * GET /api/thresholds
 */
export const getThresholds = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM thresholds");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};
