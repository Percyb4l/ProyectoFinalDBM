/**
 * @fileoverview Authentication Routes
 * 
 * Defines HTTP routes for user authentication operations.
 * These routes handle login and registration without authentication middleware.
 * 
 * @module routes/authRoutes
 */

import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token
 */
router.post("/login", login);

/**
 * POST /api/auth/register
 * Creates a new user account
 */
router.post("/register", register);

export default router;
