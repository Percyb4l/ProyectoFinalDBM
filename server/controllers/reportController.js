import pool from "../config/db.js";

export const createReport = async (req, res, next) => {
  try {
    const { generated_by, title, description, report_type } = req.body;

    const query = `
      INSERT INTO reports (generated_by, title, description, report_type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(query, [
      generated_by,
      title,
      description,
      report_type,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM reports ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};
