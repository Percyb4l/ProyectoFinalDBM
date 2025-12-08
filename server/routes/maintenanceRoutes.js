/**
 * @fileoverview Maintenance Routes
 * 
 * Defines HTTP routes for maintenance request management.
 * Maintenance requests track scheduled or emergency maintenance activities for stations.
 * All routes are prefixed with /api/maintenance when registered in the main app.
 * 
 * @module routes/maintenanceRoutes
 */

import express from "express";
import {
  createMaintenance,
  getMaintenanceByStation
} from "../controllers/maintenanceController.js";

const router = express.Router();

/**
 * POST /api/maintenance
 * Creates a new maintenance request
 */
router.post("/", createMaintenance);

/**
 * GET /api/maintenance/:station_id
 * Retrieves all maintenance requests for a specific station
 */
router.get("/:station_id", getMaintenanceByStation);

export default router;
