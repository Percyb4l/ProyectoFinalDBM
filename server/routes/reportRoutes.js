/**
 * @fileoverview Report Routes
 * 
 * Defines HTTP routes for report management operations.
 * All routes are prefixed with /api/reports when registered in the main app.
 * 
 * @module routes/reportRoutes
 */

import express from "express";
import {
  createReport,
  getReports
} from "../controllers/reportController.js";

const router = express.Router();

/**
 * GET /api/reports
 * Retrieves all reports
 */
router.get("/", getReports);

/**
 * POST /api/reports
 * Creates a new report
 */
router.post("/", createReport);

export default router;
