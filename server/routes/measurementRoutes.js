/**
 * @fileoverview Measurement Routes
 * 
 * Defines HTTP routes for environmental measurement operations.
 * All routes are prefixed with /api/measurements when registered in the main app.
 * 
 * @module routes/measurementRoutes
 */

import express from "express";
import {
  createMeasurement,
  getMeasurementsByStation,
  getMeasurementsBySensor,
  getMeasurementHistory
} from "../controllers/measurementController.js";

const router = express.Router();

/**
 * POST /api/measurements
 * Creates a new measurement record
 */
router.post("/", createMeasurement);

/**
 * GET /api/measurements/station/:id
 * Retrieves measurements for a specific station
 * Query params: ?startDate=<date>&endDate=<date>&variable_id=<id>
 */
router.get("/station/:id", getMeasurementsByStation);

/**
 * GET /api/measurements/sensor/:id
 * Retrieves measurements for a specific sensor
 */
router.get("/sensor/:id", getMeasurementsBySensor);

/**
 * GET /api/measurements/history
 * Retrieves historical measurements formatted for chart visualization
 * Query params: ?station_id=<id>&variable_id=<id>&days=<number>
 */
router.get("/history", getMeasurementHistory);

export default router;
