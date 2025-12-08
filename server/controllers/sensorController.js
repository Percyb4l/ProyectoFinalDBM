/**
 * @fileoverview Sensor Controller
 * 
 * This module handles HTTP requests related to sensor device management.
 * Sensors are physical devices installed at stations that measure environmental variables.
 * 
 * @module controllers/sensorController
 */

import pool from "../config/db.js";

/**
 * Retrieves all sensors for a specific station
 * 
 * Returns a list of all sensor devices associated with a particular monitoring station.
 * Used to display available sensors when viewing station details or creating measurements.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {number} req.params.station_id - Station ID to retrieve sensors for
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON array of sensor objects
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * GET /api/sensors/station/1
 */
export const getSensorsByStation = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sensors WHERE station_id = $1",
      [req.params.station_id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new sensor device
 * 
 * Registers a new sensor device at a monitoring station. Sensors are associated
 * with stations and can measure one or more environmental variables.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Sensor data
 * @param {number} req.body.station_id - ID of the station where sensor is installed
 * @param {string} [req.body.model] - Sensor model name/identifier
 * @param {string} [req.body.brand] - Sensor manufacturer brand
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends HTTP 201 with created sensor object
 * 
 * @throws {Error} Forwards database constraint violations (invalid station_id) and errors to error handling middleware
 * 
 * @example
 * POST /api/sensors
 * {
 *   "station_id": 1,
 *   "model": "PM-2000",
 *   "brand": "Environmental Sensors Inc"
 * }
 */
export const createSensor = async (req, res, next) => {
  try {
    const { station_id, model, brand } = req.body;

    const query = `
      INSERT INTO sensors (station_id, model, brand)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [station_id, model, brand]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
