/**
 * @fileoverview Global Error Handler Middleware
 * 
 * This module provides a centralized error handling middleware for Express.
 * Catches all errors from route handlers and sends standardized error responses.
 * Should be registered as the last middleware in the Express app.
 * 
 * @module middleware/errorHandler
 */

// middleware/errorHandler.js

/**
 * Global error handling middleware
 * 
 * Catches all errors thrown in route handlers and sends a standardized error response.
 * Logs error details to console for debugging. This middleware should be registered
 * after all routes to catch any unhandled errors.
 * 
 * @param {Error} err - Error object thrown by route handler or previous middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function (required for error middleware signature)
 * 
 * @returns {void} Sends HTTP 500 response with error message
 * 
 * @example
 * // In Express app setup:
 * app.use(errorHandler);
 */
export const errorHandler = (err, req, res, next) => {
    // Log error details for debugging (in production, consider using proper logging service)
    console.error("🔥 ERROR:", err);
    
    // Send standardized error response
    // In production, avoid exposing detailed error messages to clients
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message
    });
};
