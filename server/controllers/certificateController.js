/**
 * @fileoverview Certificate Controller
 * 
 * This module handles HTTP requests related to certificate management.
 * Certificates are documents (PDF/images) associated with stations or sensors
 * for calibration and maintenance records.
 * 
 * @module controllers/certificateController
 */

import pool from "../config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, unlinkSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Uploads a certificate file and associates it with a station or sensor
 * 
 * Handles file upload via multer, saves file metadata to database,
 * and returns certificate information.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.file - Uploaded file object from multer
 * @param {Object} req.body - Form data
 * @param {number} req.body.station_id - ID of the station (required)
 * @param {number} [req.body.sensor_id] - ID of the sensor (optional)
 * @param {string} req.body.type - Certificate type: 'calibracion' or 'mantenimiento'
 * @param {string} [req.body.expiration_date] - Expiration date (ISO format: YYYY-MM-DD)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends HTTP 201 with created certificate object
 * 
 * @throws {Error} Forwards database errors and file upload errors to error handling middleware
 * 
 * @example
 * POST /api/certificates
 * Content-Type: multipart/form-data
 * Form data:
 *   - certificate: (file)
 *   - station_id: 1
 *   - type: calibracion
 *   - expiration_date: 2025-12-31
 */
export const uploadCertificate = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No se proporcionó ningún archivo" });
    }

    const { station_id, sensor_id, type, expiration_date } = req.body;

    // Validate required fields
    if (!station_id) {
      return res.status(400).json({ error: "station_id es requerido" });
    }

    if (!type || !["calibracion", "mantenimiento"].includes(type)) {
      return res.status(400).json({
        error: "type es requerido y debe ser 'calibracion' o 'mantenimiento'",
      });
    }

    // Verify station exists
    const stationCheck = await pool.query(
      "SELECT id FROM stations WHERE id = $1",
      [station_id]
    );

    if (stationCheck.rows.length === 0) {
      return res.status(404).json({ error: "Estación no encontrada" });
    }

    // Verify sensor exists if provided
    if (sensor_id) {
      const sensorCheck = await pool.query(
        "SELECT id FROM sensors WHERE id = $1 AND station_id = $2",
        [sensor_id, station_id]
      );

      if (sensorCheck.rows.length === 0) {
        return res.status(404).json({
          error: "Sensor no encontrado o no pertenece a la estación especificada",
        });
      }
    }

    // Get user ID from request (if authenticated)
    const uploaded_by = req.user?.id || null;

    // Construct file URL (relative to uploads directory)
    // In production, this should be an absolute URL
    const fileUrl = `/uploads/certificates/${req.file.filename}`;

    // Insert certificate record into database
    const query = `
      INSERT INTO certificates (
        station_id,
        sensor_id,
        file_url,
        file_name,
        file_size,
        mime_type,
        type,
        expiration_date,
        uploaded_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await pool.query(query, [
      station_id,
      sensor_id || null,
      fileUrl,
      req.file.originalname,
      req.file.size,
      req.file.mimetype,
      type,
      expiration_date || null,
      uploaded_by,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all certificates for a specific station
 * 
 * Returns all certificates (calibration and maintenance) associated with a station,
 * optionally filtered by type.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {number} req.params.station_id - Station ID to retrieve certificates for
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.type] - Filter by certificate type: 'calibracion' or 'mantenimiento'
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON array of certificate objects
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * GET /api/certificates/1
 * GET /api/certificates/1?type=calibracion
 */
export const getCertificatesByStation = async (req, res, next) => {
  try {
    const { station_id } = req.params;
    const { type } = req.query;

    let query = `
      SELECT c.*, 
             u.name as uploaded_by_name,
             s.name as sensor_name
      FROM certificates c
      LEFT JOIN users u ON c.uploaded_by = u.id
      LEFT JOIN sensors s ON c.sensor_id = s.id
      WHERE c.station_id = $1
    `;

    const params = [station_id];

    if (type && ["calibracion", "mantenimiento"].includes(type)) {
      query += ` AND c.type = $2`;
      params.push(type);
    }

    query += ` ORDER BY c.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single certificate by ID
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {number} req.params.id - Certificate ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON object with certificate data
 */
export const getCertificateById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT c.*, 
             u.name as uploaded_by_name,
             s.name as sensor_name,
             st.name as station_name
      FROM certificates c
      LEFT JOIN users u ON c.uploaded_by = u.id
      LEFT JOIN sensors s ON c.sensor_id = s.id
      LEFT JOIN stations st ON c.station_id = st.id
      WHERE c.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Certificado no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a certificate and its associated file
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {number} req.params.id - Certificate ID to delete
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON object with success message
 */
export const deleteCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get certificate info before deleting
    const certResult = await pool.query(
      "SELECT file_url FROM certificates WHERE id = $1",
      [id]
    );

    if (certResult.rows.length === 0) {
      return res.status(404).json({ error: "Certificado no encontrado" });
    }

    // Delete from database
    await pool.query("DELETE FROM certificates WHERE id = $1", [id]);

    // Delete file from filesystem
    const filePath = path.join(
      __dirname,
      "..",
      certResult.rows[0].file_url.replace(/^\//, "")
    );

    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    } catch (fileError) {
      console.error("Error deleting file:", fileError);
      // Continue even if file deletion fails
    }

    res.json({ message: "Certificado eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};

