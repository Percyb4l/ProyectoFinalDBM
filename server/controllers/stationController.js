import pool from "../config/db.js";

export const getAllStations = async (req, res, next) => {
  try {
    const { search, status, institution_id } = req.query;
    
    let query = `SELECT s.*, i.name as institution_name 
                 FROM stations s 
                 LEFT JOIN institutions i ON s.institution_id = i.id 
                 WHERE 1=1`;
    const params = [];
    let paramCount = 0;

    // Search by name
    if (search) {
      paramCount++;
      query += ` AND s.name ILIKE $${paramCount}`;
      params.push(`%${search}%`);
    }

    // Filter by status
    if (status) {
      paramCount++;
      query += ` AND s.status = $${paramCount}`;
      params.push(status);
    }

    // Filter by institution
    if (institution_id) {
      paramCount++;
      query += ` AND s.institution_id = $${paramCount}`;
      params.push(institution_id);
    }

    query += ` ORDER BY s.id ASC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createStation = async (req, res, next) => {
  try {
    const { institution_id, name, latitude, longitude, status } = req.body;

    const query = `
      INSERT INTO stations (institution_id, name, latitude, longitude, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(query, [
      institution_id,
      name,
      latitude,
      longitude,
      status || "active",
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateStation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, latitude, longitude, status } = req.body;

    const query = `
      UPDATE stations
      SET name = $1, latitude = $2, longitude = $3, status = $4
      WHERE id = $5
      RETURNING *
    `;

    const result = await pool.query(query, [
      name,
      latitude,
      longitude,
      status,
      id,
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteStation = async (req, res, next) => {
  try {
    const query = `DELETE FROM stations WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [req.params.id]);

    res.json({ message: "Station deleted" });
  } catch (error) {
    next(error);
  }
};
