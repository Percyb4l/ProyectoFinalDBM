/**
 * @fileoverview Threshold Routes
 * 
 * Defines HTTP routes for threshold management operations.
 * All routes are prefixed with /api/thresholds when registered in the main app.
 * 
 * @module routes/thresholdRoutes
 */

import express from "express";
import {
  createThreshold,
  getThresholds
} from "../controllers/thresholdController.js";

const router = express.Router();

/**
 * POST /api/thresholds
 * Creates a new threshold definition
 */
router.post("/", createThreshold);

/**
 * GET /api/thresholds
 * Retrieves all threshold definitions
 */
router.get("/", getThresholds);

export default router;
