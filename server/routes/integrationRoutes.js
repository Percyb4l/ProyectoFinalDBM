/**
 * @fileoverview Integration Request Routes
 * 
 * Defines HTTP routes for station integration request management.
 * All routes are prefixed with /api/integrations when registered in the main app.
 * 
 * @module routes/integrationRoutes
 */

import express from "express";
import {
  createIntegrationRequest,
  approveIntegration,
  rejectIntegration,
  getIntegrationRequests
} from "../controllers/integrationController.js";

const router = express.Router();

/**
 * GET /api/integrations
 * Retrieves all integration requests
 */
router.get("/", getIntegrationRequests);

/**
 * POST /api/integrations
 * Creates a new integration request
 */
router.post("/", createIntegrationRequest);

/**
 * PUT /api/integrations/:id/approve
 * Approves an integration request
 */
router.put("/:id/approve", approveIntegration);

/**
 * PUT /api/integrations/:id/reject
 * Rejects an integration request
 */
router.put("/:id/reject", rejectIntegration);

export default router;
