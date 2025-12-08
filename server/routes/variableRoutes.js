/**
 * @fileoverview Variable Routes
 * 
 * Defines HTTP routes for environmental variable management.
 * All routes are prefixed with /api/variables when registered in the main app.
 * 
 * @module routes/variableRoutes
 */

import express from "express";
import {
  getVariables,
  createVariable
} from "../controllers/variableController.js";

const router = express.Router();

/**
 * GET /api/variables
 * Retrieves all environmental variables
 */
router.get("/", getVariables);

/**
 * POST /api/variables
 * Creates a new environmental variable
 */
router.post("/", createVariable);

export default router;
