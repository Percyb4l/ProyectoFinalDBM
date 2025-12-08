/**
 * @fileoverview Station Routes
 * 
 * Defines HTTP routes for station management operations.
 * All routes are prefixed with /api/stations when registered in the main app.
 * 
 * @module routes/stationRoutes
 */

import express from "express";
import {
  getAllStations,
  createStation,
  updateStation,
  deleteStation
} from "../controllers/stationController.js";

const router = express.Router();

/**
 * GET /api/stations
 * Retrieves all stations with optional search and filtering
 * Query params: ?search=<term>&status=<status>&institution_id=<id>
 */
router.get("/", getAllStations);

/**
 * POST /api/stations
 * Creates a new monitoring station
 */
router.post("/", createStation);

/**
 * PUT /api/stations/:id
 * Updates an existing station
 */
router.put("/:id", updateStation);

/**
 * DELETE /api/stations/:id
 * Deletes a station
 */
router.delete("/:id", deleteStation);

export default router;
