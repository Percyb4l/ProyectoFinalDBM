/**
 * @fileoverview Certificate Routes
 * 
 * Defines HTTP routes for certificate management operations.
 * Certificates are documents associated with stations (e.g., calibration certificates).
 * All routes are prefixed with /api/certificates when registered in the main app.
 * 
 * @module routes/certificateRoutes
 */

import express from "express";
import {
  uploadCertificate,
  getCertificatesByStation
} from "../controllers/certificateController.js";

const router = express.Router();

/**
 * POST /api/certificates
 * Uploads a certificate file for a station
 */
router.post("/", uploadCertificate);

/**
 * GET /api/certificates/:station_id
 * Retrieves all certificates for a specific station
 */
router.get("/:station_id", getCertificatesByStation);

export default router;
