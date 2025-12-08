import pool from "../config/db.js";

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

export const getMeasurementsByStation = async (req, res, next) => {
  try {
    const station_id = req.params.id;
    const { startDate, endDate, variable_id } = req.query;

    let query = `
      SELECT m.*, s.station_id, v.name as variable_name, v.unit
      FROM measurements m
      JOIN sensors s ON m.sensor_id = s.id
      LEFT JOIN variables v ON m.variable_id = v.id
      WHERE s.station_id = $1
    `;
    const params = [station_id];
    let paramCount = 1;

    // Filter by date range
    if (startDate) {
      paramCount++;
      query += ` AND m.timestamp >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND m.timestamp <= $${paramCount}`;
      params.push(endDate);
    }

    // Filter by variable
    if (variable_id) {
      paramCount++;
      query += ` AND m.variable_id = $${paramCount}`;
      params.push(variable_id);
    }

    query += ` ORDER BY m.timestamp DESC`;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

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
