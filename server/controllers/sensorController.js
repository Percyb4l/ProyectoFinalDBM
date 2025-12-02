import pool from "../config/db.js";

export const getSensorsByStation = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sensors WHERE station_id = $1",
      [req.params.station_id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createSensor = async (req, res, next) => {
  try {
    const { station_id, model, brand } = req.body;

    const query = `
      INSERT INTO sensors (station_id, model, brand)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [station_id, model, brand]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
