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
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { sensor_id, variable_id, value } = req.body;

    // Step 1: Insert the measurement
    const measurementQuery = `
      INSERT INTO measurements (sensor_id, variable_id, value)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const measurementResult = await client.query(measurementQuery, [
      sensor_id,
      variable_id,
      value,
    ]);

    const measurement = measurementResult.rows[0];

    // Step 2: Get station_id from sensor
    const sensorQuery = `SELECT station_id FROM sensors WHERE id = $1`;
    const sensorResult = await client.query(sensorQuery, [sensor_id]);

    if (sensorResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "Sensor no encontrado" });
    }

    const station_id = sensorResult.rows[0].station_id;

    // Step 3: Get threshold for this variable
    const thresholdQuery = `
      SELECT low, medium, high, critical
      FROM thresholds
      WHERE variable_id = $1
    `;
    const thresholdResult = await client.query(thresholdQuery, [variable_id]);

    // Step 4: Check if value exceeds thresholds and create alert if needed
    if (thresholdResult.rows.length > 0) {
      const threshold = thresholdResult.rows[0];
      let severity = null;
      let message = null;

      // Determine severity level (check from highest to lowest)
      if (threshold.critical !== null && value > threshold.critical) {
        severity = 'critical';
        message = `Valor crítico detectado: ${value} ${variable_id} excede el umbral crítico de ${threshold.critical}`;
      } else if (threshold.high !== null && value > threshold.high) {
        severity = 'high';
        message = `Valor alto detectado: ${value} ${variable_id} excede el umbral alto de ${threshold.high}`;
      } else if (threshold.medium !== null && value > threshold.medium) {
        severity = 'medium';
        message = `Valor medio detectado: ${value} ${variable_id} excede el umbral medio de ${threshold.medium}`;
      } else if (threshold.low !== null && value > threshold.low) {
        severity = 'low';
        message = `Valor bajo detectado: ${value} ${variable_id} excede el umbral bajo de ${threshold.low}`;
      }

      // Step 5: Create alert if threshold was exceeded
      if (severity) {
        // Check if there's already an active alert for this station/variable in the last hour
        const existingAlertQuery = `
          SELECT id
          FROM alerts
          WHERE station_id = $1
            AND variable_id = $2
            AND is_resolved = FALSE
            AND created_at > NOW() - INTERVAL '1 hour'
        `;
        const existingAlertResult = await client.query(existingAlertQuery, [
          station_id,
          variable_id,
        ]);

        // Only create alert if no active alert exists in the last hour
        if (existingAlertResult.rows.length === 0) {
          const alertQuery = `
            INSERT INTO alerts (station_id, variable_id, message, severity)
            VALUES ($1, $2, $3, $4)
            RETURNING *
          `;
          await client.query(alertQuery, [
            station_id,
            variable_id,
            message,
            severity,
          ]);
        }
      }
    }

    await client.query('COMMIT');
    res.status(201).json(measurement);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
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

/**
 * Retrieves historical measurements formatted for chart visualization.
 * 
 * Returns measurements for a specific station and variable over a specified
 * number of days, formatted as time-series data suitable for charting libraries.
 * Results are ordered chronologically (oldest first) for proper chart rendering.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} req.query.station_id - Station ID to retrieve measurements for
 * @param {string} req.query.variable_id - Variable ID to filter by (e.g., 'PM25', 'PM10', 'O3')
 * @param {number} [req.query.days=7] - Number of days to retrieve (default: 7)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON array of formatted measurement objects:
 *   [{ date: '2024-01-15 08:00:00', value: 12.5, unit: 'µg/m³' }, ...]
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * GET /api/measurements/history?station_id=1&variable_id=PM25&days=7
 */
export const getMeasurementHistory = async (req, res, next) => {
  try {
    const { station_id, variable_id, days = 7 } = req.query;

    // Validate required parameters
    if (!station_id || !variable_id) {
      return res.status(400).json({
        error: "station_id y variable_id son requeridos"
      });
    }

    // Calculate start date based on days parameter
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Query to get measurements with variable unit information
    const query = `
      SELECT 
        m.timestamp,
        m.value,
        v.unit,
        v.name as variable_name
      FROM measurements m
      JOIN sensors s ON m.sensor_id = s.id
      LEFT JOIN variables v ON m.variable_id = v.id
      WHERE s.station_id = $1
        AND m.variable_id = $2
        AND m.timestamp >= $3
      ORDER BY m.timestamp ASC
    `;

    const result = await pool.query(query, [
      station_id,
      variable_id,
      startDate.toISOString(),
    ]);

    // Format data for chart consumption
    const formattedData = result.rows.map((row) => ({
      date: row.timestamp,
      value: parseFloat(row.value),
      unit: row.unit || '',
      variable_name: row.variable_name || variable_id,
    }));

    res.json(formattedData);
  } catch (error) {
    next(error);
  }
};
