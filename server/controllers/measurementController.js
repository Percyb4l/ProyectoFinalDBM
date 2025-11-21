const pool = require('../config/db');

const createMeasurement = async (req, res) => {
    const { value, station_id, variable_id } = req.body;

    if (value === undefined || !station_id || !variable_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const query = `
            INSERT INTO measurements (value, station_id, variable_id, timestamp)
            VALUES ($1, $2, $3, NOW())
            RETURNING *
        `;
        const values = [value, station_id, variable_id];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating measurement:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMeasurementsByStation = async (req, res) => {
    const { stationId } = req.params;
    try {
        const query = 'SELECT * FROM measurements WHERE station_id = $1 ORDER BY timestamp DESC';
        const result = await pool.query(query, [stationId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching measurements:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createMeasurement,
    getMeasurementsByStation
};
