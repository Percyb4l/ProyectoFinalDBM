/**
 * @fileoverview Sensor Variable Routes
 * 
 * Defines HTTP routes for managing sensor-variable associations.
 * Links sensors to the environmental variables they can measure.
 * All routes are prefixed with /api/sensor-variables when registered in the main app.
 * 
 * @module routes/sensorVariableRoutes
 */

import express from "express";
import {
  assignVariableToSensor
} from "../controllers/sensorVariableController.js";

const router = express.Router();

/**
 * POST /api/sensor-variables
 * Assigns an environmental variable to a sensor
 * Body: { sensor_id: number, variable_id: string }
 */
router.post("/", assignVariableToSensor);

export default router;
