/**
 * @fileoverview Integration Request Controller
 * 
 * This module handles HTTP requests related to station integration requests.
 * Integration requests allow institutions to request adding their monitoring stations
 * to the system, which must be approved by administrators.
 * 
 * @module controllers/integrationController
 */

import pool from "../config/db.js";

/**
 * Creates a new integration request
 * 
 * Allows institutions to submit requests for adding new monitoring stations to the system.
 * Requests are created with 'pending' status and must be reviewed by administrators.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Integration request data
 * @param {string} req.body.station_name - Name of the station to be integrated
 * @param {number} [req.body.requested_by] - ID of the user making the request
 * @param {number} [req.body.institution_id] - ID of the institution requesting integration
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends HTTP 201 with created integration request object
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * POST /api/integrations
 * {
 *   "station_name": "New Monitoring Station",
 *   "requested_by": 5,
 *   "institution_id": 2
 * }
 */
export const createIntegrationRequest = async (req, res, next) => {
  try {
    const { station_name, requested_by, institution_id } = req.body;

    const query = `
      INSERT INTO integration_requests (station_name, requested_by, institution_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [
      station_name,
      requested_by,
      institution_id,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Approves an integration request
 * 
 * Marks an integration request as approved and records the review timestamp.
 * This action typically triggers the creation of the actual station in the system.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {number} req.params.id - Integration request ID to approve
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON object with updated integration request
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * PUT /api/integrations/1/approve
 */
export const approveIntegration = async (req, res, next) => {
  try {
    const query = `
      UPDATE integration_requests
      SET status = 'approved', reviewed_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [req.params.id]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Rejects an integration request
 * 
 * Marks an integration request as rejected and records the review timestamp.
 * Rejected requests are kept for audit purposes but do not result in station creation.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {number} req.params.id - Integration request ID to reject
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON object with updated integration request
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * PUT /api/integrations/1/reject
 */
export const rejectIntegration = async (req, res, next) => {
  try {
    const query = `
      UPDATE integration_requests
      SET status = 'rejected', reviewed_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [req.params.id]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all integration requests from the database
 * 
 * Returns all integration requests regardless of status (pending, approved, rejected).
 * Used by administrators to review and manage station integration requests.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON array of integration request objects
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * GET /api/integrations
 */
export const getIntegrationRequests = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM integration_requests");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};
