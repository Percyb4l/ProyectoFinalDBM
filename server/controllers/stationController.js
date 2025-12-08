/**
 * @fileoverview Station Controller
 * 
 * This module handles all HTTP requests related to station management.
 * Provides CRUD operations and advanced filtering capabilities for monitoring stations.
 * 
 * @module controllers/stationController
 */

import pool from "../config/db.js";

/**
 * Retrieves all stations with optional search and filtering capabilities.
 * 
 * Supports filtering by station name (case-insensitive search), status, and institution.
 * Returns stations with their associated institution information.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.search] - Search term to filter stations by name (case-insensitive)
 * @param {string} [req.query.status] - Filter by station status: 'active', 'inactive', or 'maintenance'
 * @param {number} [req.query.institution_id] - Filter by institution ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON array of station objects with institution_name
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * // Get all active stations
 * GET /api/stations?status=active
 * 
 * @example
 * // Search for stations by name
 * GET /api/stations?search=central
 */
export const getAllStations = async (req, res, next) => {
  try {
    const { search, status, institution_id } = req.query;
    
    // Check if technician_id column exists in stations table
    // This allows the code to work even if the migration hasn't been run yet
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'stations' AND column_name = 'technician_id'
    `);
    
    const hasTechnicianId = columnCheck.rows.length > 0;
    
    // Base query with LEFT JOIN to include institution name and technician name even if station has no institution/technician
    // Using WHERE 1=1 allows dynamic WHERE clause construction without complex conditionals
    let query = `SELECT s.*, 
                        i.name as institution_name`;
    
    // Only include technician fields if the column exists
    if (hasTechnicianId) {
      query += `,
                        u.name as technician_name,
                        u.email as technician_email`;
    }
    
    query += ` FROM stations s 
                 LEFT JOIN institutions i ON s.institution_id = i.id`;
    
    // Only join users table if technician_id column exists
    if (hasTechnicianId) {
      query += ` LEFT JOIN users u ON s.technician_id = u.id`;
    }
    
    query += ` WHERE 1=1`;
    const params = [];
    let paramCount = 0;

    // Search by name - ILIKE provides case-insensitive pattern matching
    if (search) {
      paramCount++;
      query += ` AND s.name ILIKE $${paramCount}`;
      // Wrap search term with % for partial matching
      params.push(`%${search}%`);
    }

    // Filter by status - exact match for predefined status values
    if (status) {
      paramCount++;
      query += ` AND s.status = $${paramCount}`;
      params.push(status);
    }

    // Filter by institution - allows filtering stations belonging to specific institutions
    if (institution_id) {
      paramCount++;
      query += ` AND s.institution_id = $${paramCount}`;
      params.push(institution_id);
    }

    // Order results by ID for consistent pagination
    query += ` ORDER BY s.id ASC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new monitoring station in the database.
 * 
 * Creates station, associated sensor (if provided), and links sensor to variables.
 * Uses a transaction to ensure all-or-nothing creation.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Station data
 * @param {number} [req.body.institution_id] - ID of the institution owning this station (nullable)
 * @param {string} req.body.name - Station name (required)
 * @param {number} req.body.latitude - Geographic latitude coordinate (required)
 * @param {number} req.body.longitude - Geographic longitude coordinate (required)
 * @param {string} [req.body.status='active'] - Station status: 'active', 'inactive', or 'maintenance'
 * @param {number} [req.body.technician_id] - ID of the user responsible for technical maintenance (nullable)
 * @param {string} [req.body.sensor_model] - Sensor model name (optional, creates sensor if provided)
 * @param {string} [req.body.sensor_brand] - Sensor brand/manufacturer (optional, creates sensor if provided)
 * @param {string[]} [req.body.variable_ids] - Array of variable IDs that the sensor measures (optional)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends HTTP 201 with created station object including sensor and variables info
 * 
 * @throws {Error} Forwards database constraint violations and errors to error handling middleware
 * 
 * @example
 * POST /api/stations
 * {
 *   "name": "Central Station",
 *   "latitude": 40.7128,
 *   "longitude": -74.0060,
 *   "status": "active",
 *   "institution_id": 1,
 *   "technician_id": 5,
 *   "sensor_model": "PM-2000",
 *   "sensor_brand": "Environmental Sensors Inc",
 *   "variable_ids": ["PM25", "PM10", "O3"]
 * }
 */
export const createStation = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { 
      institution_id, 
      name, 
      latitude, 
      longitude, 
      status,
      technician_id,
      sensor_model,
      sensor_brand,
      variable_ids = []
    } = req.body;

    // Step 1: Create the station
    const stationQuery = `
      INSERT INTO stations (institution_id, name, latitude, longitude, status, technician_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const stationResult = await client.query(stationQuery, [
      institution_id || null,
      name,
      latitude,
      longitude,
      status || "active",
      technician_id || null
    ]);

    const station = stationResult.rows[0];
    let sensor = null;
    let createdVariables = [];

    // Step 2: Create sensor if model/brand provided
    if (sensor_model || sensor_brand) {
      const sensorQuery = `
        INSERT INTO sensors (station_id, model, brand, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const sensorResult = await client.query(sensorQuery, [
        station.id,
        sensor_model || null,
        sensor_brand || null,
        'active'
      ]);

      sensor = sensorResult.rows[0];

      // Step 3: Link sensor to variables if provided
      if (variable_ids && variable_ids.length > 0 && sensor) {
        // Validate that all variable_ids exist
        const variableCheckQuery = `
          SELECT id FROM variables WHERE id = ANY($1::VARCHAR[])
        `;
        const validVariables = await client.query(variableCheckQuery, [variable_ids]);
        
        if (validVariables.rows.length !== variable_ids.length) {
          throw new Error('One or more variable IDs are invalid');
        }

        // Insert sensor-variable relationships
        const insertPromises = variable_ids.map(variableId => 
          client.query(
            `INSERT INTO sensor_variables (sensor_id, variable_id) VALUES ($1, $2) RETURNING *`,
            [sensor.id, variableId]
          )
        );

        const variableResults = await Promise.all(insertPromises);
        createdVariables = variableResults.map(r => r.rows[0]);
      }
    }

    await client.query('COMMIT');

    // Return station with associated sensor and variables info
    res.status(201).json({
      ...station,
      sensor: sensor,
      variables: createdVariables
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

/**
 * Updates an existing station's information.
 * 
 * Updates station name, coordinates, and status. Institution association cannot be changed
 * through this endpoint (use separate endpoint if needed).
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {number} req.params.id - Station ID to update
 * @param {Object} req.body - Updated station data
 * @param {string} req.body.name - Updated station name
 * @param {number} req.body.latitude - Updated latitude coordinate
 * @param {number} req.body.longitude - Updated longitude coordinate
 * @param {string} req.body.status - Updated status: 'active', 'inactive', or 'maintenance'
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON object with updated station data
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * PUT /api/stations/1
 * {
 *   "name": "Updated Station Name",
 *   "latitude": 40.7128,
 *   "longitude": -74.0060,
 *   "status": "maintenance"
 * }
 */
export const updateStation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, latitude, longitude, status, technician_id } = req.body;

    const query = `
      UPDATE stations
      SET name = $1, latitude = $2, longitude = $3, status = $4, technician_id = $5
      WHERE id = $6
      RETURNING *
    `;

    const result = await pool.query(query, [
      name,
      latitude,
      longitude,
      status,
      technician_id || null,
      id,
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a station from the database.
 * 
 * Permanently removes the station record. Associated sensors and measurements
 * may be cascade deleted depending on database foreign key constraints.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {number} req.params.id - Station ID to delete
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON object with success message
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * DELETE /api/stations/1
 */
export const deleteStation = async (req, res, next) => {
  try {
    const query = `DELETE FROM stations WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [req.params.id]);

    res.json({ message: "Station deleted" });
  } catch (error) {
    next(error);
  }
};
