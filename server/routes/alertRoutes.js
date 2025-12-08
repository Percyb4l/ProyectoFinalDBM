/**
 * @fileoverview Alert Routes
 * 
 * Defines HTTP routes for alert management operations.
 * All routes are prefixed with /api/alerts when registered in the main app.
 * 
 * @module routes/alertRoutes
 */

import express from "express";
import {
  createAlert,
  getAlerts,
  resolveAlert
} from "../controllers/alertController.js";

const router = express.Router();

/**
 * GET /api/alerts
 * Retrieves all alerts
 */
router.get("/", getAlerts);

/**
 * POST /api/alerts
 * Creates a new alert
 */
router.post("/", createAlert);

/**
 * PUT /api/alerts/:id/resolve
 * Marks an alert as resolved
 */
router.put("/:id/resolve", resolveAlert);

export default router;
