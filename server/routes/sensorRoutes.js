/**
 * @fileoverview Sensor Routes
 * 
 * Defines HTTP routes for sensor management operations.
 * All routes are prefixed with /api/sensors when registered in the main app.
 * 
 * @module routes/sensorRoutes
 */

import express from "express";
import {
  getSensorsByStation,
  createSensor
} from "../controllers/sensorController.js";

const router = express.Router();

/**
 * GET /api/sensors/:station_id
 * Retrieves all sensors for a specific station
 */
router.get("/:station_id", getSensorsByStation);

/**
 * POST /api/sensors
 * Creates a new sensor
 */
router.post("/", createSensor);

export default router;
