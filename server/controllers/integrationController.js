import pool from "../config/db.js";

export const createIntegrationRequest = async (req, res, next) => {
  try {
    const { station_name, requested_by, institution_id } = req.body;

    const query = `
      INSERT INTO integration_requests (station_name, requested_by, institution_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [
      station_name,
      requested_by,
      institution_id,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const approveIntegration = async (req, res, next) => {
  try {
    const query = `
      UPDATE integration_requests
      SET status = 'approved', reviewed_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [req.params.id]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const rejectIntegration = async (req, res, next) => {
  try {
    const query = `
      UPDATE integration_requests
      SET status = 'rejected', reviewed_at = NOW()
      WHERE id = $1
      RETURNRETURNING *
    `;

    const result = await pool.query(query, [req.params.id]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getIntegrationRequests = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM integration_requests");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};
