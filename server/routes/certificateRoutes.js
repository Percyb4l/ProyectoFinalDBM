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
  getCertificatesByStation,
  getCertificateById,
  deleteCertificate
} from "../controllers/certificateController.js";
import { uploadCertificate as multerMiddleware } from "../config/multer.js";

const router = express.Router();

/**
 * POST /api/certificates
 * Uploads a certificate file for a station
 * Uses multer middleware to handle file upload
 * Body (multipart/form-data):
 *   - certificate: (file) PDF or image file
 *   - station_id: (number) Required
 *   - sensor_id: (number) Optional
 *   - type: (string) 'calibracion' or 'mantenimiento'
 *   - expiration_date: (string) Optional, ISO date format
 */
router.post("/", multerMiddleware, uploadCertificate);

/**
 * GET /api/certificates/station/:station_id
 * Retrieves all certificates for a specific station
 * Query params: ?type=calibracion|mantenimiento (optional filter)
 */
router.get("/station/:station_id", getCertificatesByStation);

/**
 * GET /api/certificates/:id
 * Retrieves a single certificate by ID
 */
router.get("/:id", getCertificateById);

/**
 * DELETE /api/certificates/:id
 * Deletes a certificate and its associated file
 */
router.delete("/:id", deleteCertificate);

export default router;
