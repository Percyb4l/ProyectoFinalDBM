import pool from "../config/db.js";

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

export const getThresholds = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM thresholds");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};
