const pool = require('../config/db');

const getAllStations = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM stations ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching stations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createStation = async (req, res) => {
    const { name, latitude, longitude, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO stations (name, latitude, longitude, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, latitude, longitude, status !== undefined ? status : true]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating station:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateStation = async (req, res) => {
    const { id } = req.params;
    const { name, latitude, longitude, status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE stations SET name = $1, latitude = $2, longitude = $3, status = $4 WHERE id = $5 RETURNING *',
            [name, latitude, longitude, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Station not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating station:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteStation = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM stations WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Station not found' });
        }
        res.json({ message: 'Station deleted successfully' });
    } catch (error) {
        console.error('Error deleting station:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllStations,
    createStation,
    updateStation,
    deleteStation
};
