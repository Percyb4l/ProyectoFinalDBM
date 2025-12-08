/**
 * @fileoverview Authentication Controller
 * 
 * This module handles user authentication operations including login and registration.
 * Uses bcrypt for password hashing and JWT for token generation.
 * 
 * @module controllers/authController
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

/**
 * Authenticates a user and returns a JWT token
 * 
 * Validates user credentials by checking email and password against the database.
 * On successful authentication, generates a JWT token containing user ID and role.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User email address
 * @param {string} req.body.password - User password (plain text)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends JSON response with token and user data, or error message
 * 
 * @throws {Error} Forwards database errors to error handling middleware
 * 
 * @example
 * POST /api/auth/login
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Query user by email with institution data - email is unique in the database
    const query = `
      SELECT 
        u.*,
        i.id as institution_id_full,
        i.name as institution_name,
        i.color_primary,
        i.color_secondary,
        i.logo_url
      FROM users u
      LEFT JOIN institutions i ON u.institution_id = i.id
      WHERE u.email = $1
    `;
    const result = await pool.query(query, [email]);

    // Return 401 if user not found (don't reveal if email exists)
    if (result.rows.length === 0)
      return res.status(401).json({ error: "Usuario no encontrado" });

    const userRow = result.rows[0];

    // Compare provided password with hashed password in database
    const validPassword = await bcrypt.compare(password, userRow.password);
    if (!validPassword)
      return res.status(401).json({ error: "Contraseña incorrecta" });

    // Build user object with institution data if available
    const user = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role,
      institution_id: userRow.institution_id,
    };

    // Include institution data if user has an institution
    if (userRow.institution_id_full) {
      user.institution = {
        id: userRow.institution_id_full,
        name: userRow.institution_name,
        color_primary: userRow.color_primary,
        color_secondary: userRow.color_secondary,
        logo_url: userRow.logo_url,
      };
    }

    // Generate JWT token with user ID and role
    // Token expiration is set via JWT_EXPIRES environment variable
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Registers a new user in the system
 * 
 * Creates a new user account with hashed password. Supports optional institution
 * association for institution-specific users.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address (must be unique)
 * @param {string} req.body.password - User's password (will be hashed)
 * @param {string} req.body.role - User role (e.g., 'admin_general', 'admin_institucion', 'operador_estacion')
 * @param {number} [req.body.institution_id] - Optional institution ID for institution-specific users
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Promise<void>} Sends HTTP 201 with created user object (password excluded)
 * 
 * @throws {Error} Forwards database constraint violations (duplicate email) and errors to error handling middleware
 * 
 * @example
 * POST /api/auth/register
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "securePassword123",
 *   "role": "admin_institucion",
 *   "institution_id": 1
 * }
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, institution_id } = req.body;

    // Hash password with bcrypt (10 rounds for security/performance balance)
    const hashedPass = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, email, password, role, institution_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(query, [
      name,
      email,
      hashedPass,
      role,
      institution_id || null, // Allow null for users not associated with institutions
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
