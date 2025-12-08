/**
 * @fileoverview Database Configuration Module
 * 
 * This module configures and exports the PostgreSQL connection pool.
 * Uses environment variables for configuration to support different deployment environments.
 * 
 * @module config/db
 */

// server/config/db.js
// =========================================
// PostgreSQL Connection using ES Modules
// =========================================

import pkg from "pg";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const { Pool } = pkg;

/**
 * PostgreSQL connection pool configuration
 * 
 * Creates a connection pool with settings from environment variables.
 * Falls back to default values if environment variables are not set.
 * 
 * @type {Pool}
 * @property {string} host - Database host (default: 'localhost')
 * @property {string} user - Database user (default: 'postgres')
 * @property {string} password - Database password (default: 'postgres')
 * @property {string} database - Database name (default: 'vrisa_db')
 * @property {number} port - Database port (default: 5432)
 */
const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "vrisa_db",
    port: process.env.DB_PORT || 5432
});

/**
 * Tests database connection on module load
 * 
 * Attempts to establish a connection to verify database accessibility.
 * Logs success or error message to console. This is a one-time check
 * when the module is first imported.
 */
pool.connect()
    .then(() => console.log("📡 PostgreSQL conectado correctamente"))
    .catch(err => console.error("❌ Error conectando a la BD:", err));

/**
 * Exports the PostgreSQL connection pool
 * 
 * This pool should be used for all database queries throughout the application.
 * The pool manages multiple connections efficiently and handles connection lifecycle.
 * 
 * @default
 */
export default pool;
