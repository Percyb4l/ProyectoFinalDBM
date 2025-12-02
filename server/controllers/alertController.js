import pool from "../config/db.js";

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

export const getAlerts = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM alerts ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

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
