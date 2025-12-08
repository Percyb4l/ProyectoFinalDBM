/**
 * @fileoverview Institution Controller
 * 
 * This module handles HTTP requests related to institution management.
 * Institutions represent organizations that own and operate monitoring stations.
 * 
 * @module controllers/institutionController
 */

import pool from "../config/db.js";

/**
 * Retrieves all institutions from the database
 * 
 * Returns a list of all registered institutions ordered by ID.
 * Used for populating institution dropdowns and listing available institutions.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON array of institution objects
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * GET /api/institutions
 */
export const getInstitutions = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM institutions ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new institution in the database
 * 
 * Registers a new organization that can own and operate monitoring stations.
 * Supports custom branding with logo URL and color scheme.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Institution data
 * @param {string} req.body.name - Institution name (required)
 * @param {string} [req.body.logo_url] - URL to institution logo image
 * @param {string} [req.body.color_primary] - Primary brand color (hex code)
 * @param {string} [req.body.color_secondary] - Secondary brand color (hex code)
 * @param {string} [req.body.address] - Institution physical address
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends HTTP 201 with created institution object
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * POST /api/institutions
 * {
 *   "name": "Environmental Agency",
 *   "address": "123 Main St",
 *   "color_primary": "#1d4ed8",
 *   "color_secondary": "#3b82f6"
 * }
 */
export const createInstitution = async (req, res, next) => {
  try {
    const { name, logo_url, color_primary, color_secondary, address } = req.body;

    const query = `
      INSERT INTO institutions (name, logo_url, color_primary, color_secondary, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(query, [
      name,
      logo_url,
      color_primary,
      color_secondary,
      address,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Verifies an institution
 * 
 * Marks an institution as verified, indicating it has been reviewed and approved
 * by system administrators. Verified institutions may have additional privileges.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {number} req.params.id - Institution ID to verify
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON object with updated institution data
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * PUT /api/institutions/1/verify
 */
export const verifyInstitution = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE institutions SET is_verified = TRUE WHERE id = $1 RETURNING *
    `;

    const result = await pool.query(query, [id]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
