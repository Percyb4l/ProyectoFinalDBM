const pool = require('../config/db');

const getMeasurements = async (req, res) => {
    try {
        const { station_id, variable_id, start_date, end_date } = req.query;

        let query = 'SELECT * FROM measurements WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (station_id) {
            query += ` AND station_id = $${paramCount}`;
            values.push(station_id);
            paramCount++;
        }

        if (variable_id) {
            query += ` AND variable_id = $${paramCount}`;
            values.push(variable_id);
            paramCount++;
        }

        if (start_date) {
            query += ` AND measured_at >= $${paramCount}`;
            values.push(start_date);
            paramCount++;
        }

        if (end_date) {
            query += ` AND measured_at <= $${paramCount}`;
            values.push(end_date);
            paramCount++;
        }

        query += ' ORDER BY measured_at DESC LIMIT 100';

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching measurements:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createMeasurement = async (req, res) => {
    try {
        const { station_id, variable_id, value, measured_at } = req.body;

        const query = `
      INSERT INTO measurements (station_id, variable_id, value, measured_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const values = [station_id, variable_id, value, measured_at || new Date()];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating measurement:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getMeasurements,
    createMeasurement
};
