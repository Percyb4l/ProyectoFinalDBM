/**
 * @fileoverview Main Server Entry Point
 * 
 * This is the main entry point for the VriSA backend server.
 * Configures Express application, registers middleware, and sets up API routes.
 * 
 * @module server/index
 */

// index.js
// =======================================================
// VriSA Backend Entry Point (Express + PostgreSQL)
// =======================================================

// Load environment variables from .env file first
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
// Import database config to initialize connection and log status
import "./config/db.js";

// Middlewares
import { errorHandler } from "./middleware/errorHandler.js";

// Route modules
import stationRoutes from "./routes/stationRoutes.js";
import measurementRoutes from "./routes/measurementRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import institutionRoutes from "./routes/institutionRoutes.js";
import thresholdRoutes from "./routes/thresholdRoutes.js";
import integrationRoutes from "./routes/integrationRoutes.js";
import variableRoutes from "./routes/variableRoutes.js";

/**
 * Express application instance
 * @type {express.Application}
 */
const app = express();

// Global middleware configuration
// CORS allows cross-origin requests from frontend
app.use(cors());
// JSON parser for request bodies
app.use(express.json());

/**
 * Health check route
 * 
 * Simple endpoint to verify server is running.
 * Useful for monitoring and deployment verification.
 * 
 * @route GET /
 * @returns {string} Server status message
 */
app.get("/", (req, res) => {
    res.send("Backend VRISA is running!");
});

// API Routes (all prefixed with /api/...)
// Register route modules with their base paths
app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/thresholds", thresholdRoutes);
app.use("/api/integrations", integrationRoutes);
app.use("/api/variables", variableRoutes);

// Global error handler middleware (MUST be registered last)
// Catches all errors from route handlers and sends standardized responses
app.use(errorHandler);

/**
 * Server port configuration
 * Uses PORT environment variable or defaults to 3001
 * @type {number}
 */
const PORT = process.env.PORT || 3001;

/**
 * Start the Express server
 * 
 * Listens on the configured port and logs startup message.
 */
app.listen(PORT, () => {
    console.log(`🚀 Backend VRISA corriendo en puerto ${PORT}`);
});
