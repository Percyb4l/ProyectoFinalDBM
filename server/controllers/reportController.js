const pool = require('../config/db');

const getReports = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createReport = async (req, res) => {
    const { title, description, report_type, user_id } = req.body;

    // Mock generation logic - in real app this would generate a file
    const mockFilePath = `/reports/${Date.now()}_${report_type}.pdf`;

    try {
        const query = `
            INSERT INTO reports (title, description, report_type, generated_by, file_path)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [title, description, report_type, user_id, mockFilePath];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getReports,
    createReport
};
