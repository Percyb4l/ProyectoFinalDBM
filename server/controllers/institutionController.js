import pool from "../config/db.js";

export const getInstitutions = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM institutions ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createInstitution = async (req, res, next) => {
  try {
    const { name, logo_url, color_primary, color_secondary, address } = req.body;

    const query = `
      INSERT INTO institutions (name, logo_url, color_primary, color_secondary, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(query, [
      name,
      logo_url,
      color_primary,
      color_secondary,
      address,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const verifyInstitution = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE institutions SET is_verified = TRUE WHERE id = $1 RETURNING *
    `;

    const result = await pool.query(query, [id]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
