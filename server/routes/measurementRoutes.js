const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');

router.post('/', measurementController.createMeasurement);
router.get('/:stationId', measurementController.getMeasurementsByStation);

module.exports = router;
