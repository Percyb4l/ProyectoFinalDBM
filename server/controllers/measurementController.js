/**
 * @fileoverview Measurement Controller
 * 
 * This module handles all HTTP requests related to environmental measurements.
 * Provides functionality to create measurements and retrieve them with advanced filtering
 * by station, sensor, date range, and variable type.
 * 
 * @module controllers/measurementController
 */

import pool from "../config/db.js";

/**
 * Creates a new environmental measurement record.
 * 
 * Records a measurement value from a specific sensor for a specific environmental variable.
 * The timestamp is automatically set by the database (CURRENT_TIMESTAMP).
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Measurement data
 * @param {number} req.body.sensor_id - ID of the sensor that recorded this measurement
 * @param {string} req.body.variable_id - ID of the environmental variable being measured (e.g., 'PM25', 'O3')
 * @param {number} req.body.value - Numeric measurement value
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends HTTP 201 with created measurement object including auto-generated timestamp
 * 
 * @throws {Error} Forwards database constraint violations and errors to error handling middleware
 * 
 * @example
 * POST /api/measurements
 * {
 *   "sensor_id": 1,
 *   "variable_id": "PM25",
 *   "value": 15.5
 * }
 */
export const createMeasurement = async (req, res, next) => {
  try {
    const { sensor_id, variable_id, value } = req.body;

    const query = `
      INSERT INTO measurements (sensor_id, variable_id, value)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [sensor_id, variable_id, value]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all measurements for a specific station with optional filtering.
 * 
 * Supports filtering by date range and variable type. Returns measurements with
 * associated variable information (name and unit) for display purposes.
 * Results are ordered by timestamp descending (most recent first).
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {number} req.params.id - Station ID to retrieve measurements for
 * @param {Object} req.query - Optional query parameters for filtering
 * @param {string} [req.query.startDate] - Start date for date range filter (ISO 8601 format: YYYY-MM-DD)
 * @param {string} [req.query.endDate] - End date for date range filter (ISO 8601 format: YYYY-MM-DD)
 * @param {string} [req.query.variable_id] - Filter by specific variable ID (e.g., 'PM25', 'O3', 'NO2')
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON array of measurement objects with variable_name and unit
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * // Get all measurements for station 1
 * GET /api/measurements/station/1
 * 
 * @example
 * // Get PM25 measurements for the last week
 * GET /api/measurements/station/1?variable_id=PM25&startDate=2024-01-01&endDate=2024-01-07
 */
export const getMeasurementsByStation = async (req, res, next) => {
  try {
    const station_id = req.params.id;
    const { startDate, endDate, variable_id } = req.query;

    // Base query joins measurements with sensors (to get station_id) and variables (for display info)
    // LEFT JOIN on variables ensures measurements are returned even if variable info is missing
    let query = `
      SELECT m.*, s.station_id, v.name as variable_name, v.unit
      FROM measurements m
      JOIN sensors s ON m.sensor_id = s.id
      LEFT JOIN variables v ON m.variable_id = v.id
      WHERE s.station_id = $1
    `;
    const params = [station_id];
    let paramCount = 1;

    // Filter by date range - startDate filters measurements from this date onwards
    if (startDate) {
      paramCount++;
      query += ` AND m.timestamp >= $${paramCount}`;
      params.push(startDate);
    }

    // Filter by date range - endDate filters measurements up to and including this date
    if (endDate) {
      paramCount++;
      query += ` AND m.timestamp <= $${paramCount}`;
      params.push(endDate);
    }

    // Filter by variable type - allows filtering for specific environmental parameters
    if (variable_id) {
      paramCount++;
      query += ` AND m.variable_id = $${paramCount}`;
      params.push(variable_id);
    }

    // Order by most recent first for better UX when displaying time-series data
    query += ` ORDER BY m.timestamp DESC`;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all measurements for a specific sensor.
 * 
 * Returns all measurement records associated with a particular sensor device,
 * ordered by timestamp descending.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {number} req.params.id - Sensor ID to retrieve measurements for
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON array of measurement objects
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * GET /api/measurements/sensor/5
 */
export const getMeasurementsBySensor = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM measurements WHERE sensor_id = $1`,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};
