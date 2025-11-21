const pool = require('../config/db');

const getAlerts = async (req, res) => {
    try {
        const { station_id, is_resolved } = req.query;
        let query = 'SELECT * FROM alerts WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (station_id) {
            query += ` AND station_id = $${paramCount}`;
            values.push(station_id);
            paramCount++;
        }

        if (is_resolved !== undefined) {
            query += ` AND is_resolved = $${paramCount}`;
            values.push(is_resolved === 'true');
            paramCount++;
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createAlert = async (req, res) => {
    const { station_id, variable_id, message, severity } = req.body;
    try {
        const query = `
            INSERT INTO alerts (station_id, variable_id, message, severity)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [station_id, variable_id, message, severity || 'medium'];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating alert:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const resolveAlert = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            UPDATE alerts 
            SET is_resolved = TRUE, resolved_at = NOW() 
            WHERE id = $1 
            RETURNING *
        `;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Alert not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error resolving alert:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAlerts,
    createAlert,
    resolveAlert
};
