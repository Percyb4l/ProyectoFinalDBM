const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const stationRoutes = require('./routes/stationRoutes');
const measurementRoutes = require('./routes/measurementRoutes');
const alertRoutes = require('./routes/alertRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // Fail-safe: Allow any origin
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('VriSA API is running');
});

// Start server
app.listen(PORT, '0.0.0.0', () => { // Fail-safe: Bind to all interfaces
    console.log(`Server is running on port ${PORT}`);
});
