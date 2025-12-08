/**
 * @fileoverview Institution Routes
 * 
 * Defines HTTP routes for institution management operations.
 * All routes are prefixed with /api/institutions when registered in the main app.
 * 
 * @module routes/institutionRoutes
 */

import express from "express";
import {
  createInstitution,
  getInstitutions,
  verifyInstitution
} from "../controllers/institutionController.js";

const router = express.Router();

/**
 * GET /api/institutions
 * Retrieves all institutions
 */
router.get("/", getInstitutions);

/**
 * POST /api/institutions
 * Creates a new institution
 */
router.post("/", createInstitution);

/**
 * PUT /api/institutions/:id/verify
 * Verifies an institution
 */
router.put("/:id/verify", verifyInstitution);

export default router;
