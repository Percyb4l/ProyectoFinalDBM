/**
 * @fileoverview Variable Controller
 * 
 * This module handles HTTP requests related to environmental variables (measurement types).
 * Environmental variables define what types of measurements can be recorded (e.g., PM2.5, O3, NO2).
 * 
 * @module controllers/variableController
 */

import pool from "../config/db.js";

/**
 * Retrieves all environmental variables from the database.
 * 
 * Returns a list of all available measurement variable types with their names and units.
 * Variables are ordered by ID for consistent display.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON array of variable objects with id, name, and unit
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * GET /api/variables
 * // Returns: [{ id: 'PM25', name: 'Particulate Matter 2.5', unit: 'µg/m³' }, ...]
 */
export const getVariables = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM variables ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new environmental variable definition.
 * 
 * Adds a new type of measurement variable that can be used when recording measurements.
 * The variable ID must be unique and typically follows a short code format (e.g., 'PM25', 'O3').
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Variable data
 * @param {string} req.body.id - Unique identifier for the variable (e.g., 'PM25', 'NO2', 'O3')
 * @param {string} req.body.name - Human-readable name of the variable (e.g., 'Particulate Matter 2.5')
 * @param {string} req.body.unit - Unit of measurement (e.g., 'µg/m³', 'ppb', 'ppm', '°C')
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends HTTP 201 with created variable object
 * 
 * @throws {Error} Forwards database constraint violations (duplicate ID) and errors to error handling middleware
 * 
 * @example
 * POST /api/variables
 * {
 *   "id": "PM10",
 *   "name": "Particulate Matter 10",
 *   "unit": "µg/m³"
 * }
 */
export const createVariable = async (req, res, next) => {
  try {
    const { id, name, unit } = req.body;

    const query = `
      INSERT INTO variables (id, name, unit)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [id, name, unit]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
