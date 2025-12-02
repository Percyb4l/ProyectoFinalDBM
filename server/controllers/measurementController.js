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

    const query = `
      SELECT m.*, s.station_id
      FROM measurements m
      JOIN sensors s ON m.sensor_id = s.id
      WHERE s.station_id = $1
    `;

    const result = await pool.query(query, [station_id]);

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
