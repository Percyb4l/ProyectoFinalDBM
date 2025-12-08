import pool from "../config/db.js";

export const getVariables = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM variables ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

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

