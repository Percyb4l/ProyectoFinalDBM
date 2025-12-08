/**
 * @fileoverview Authentication Middleware
 * 
 * This module provides Express middleware for protecting routes with JWT authentication.
 * Supports role-based access control by optionally restricting routes to specific user roles.
 * 
 * @module middleware/authMiddleware
 */

// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

/**
 * Creates authentication middleware with optional role-based access control
 * 
 * Validates JWT tokens from Authorization header and optionally checks if user
 * has required role. Attaches decoded user information to request object for use
 * in route handlers.
 * 
 * @param {string[]} [roles=[]] - Optional array of allowed roles. If empty, any authenticated user can access.
 * 
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Protect route - any authenticated user
 * router.get('/protected', requireAuth(), handler);
 * 
 * @example
 * // Protect route - only admins
 * router.get('/admin', requireAuth(['admin_general']), handler);
 * 
 * @example
 * // Protect route - multiple roles allowed
 * router.get('/data', requireAuth(['admin_general', 'admin_institucion']), handler);
 */
export const requireAuth = (roles = []) => {
    return (req, res, next) => {
        // Extract token from Authorization header
        // Expected format: "Bearer <token>"
        const header = req.headers.authorization;
        const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : null;

        // Return 401 if no token provided
        if (!token)
            return res.status(401).json({ error: "No token provided" });

        try {
            // Verify and decode JWT token using secret from environment
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check role-based access control if roles are specified
            // If roles array is not empty and user's role is not in the list, deny access
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ error: "Forbidden" });
            }

            // Attach decoded user info to request object for use in route handlers
            // Contains: { id, role, ... } (based on what was signed in JWT)
            req.user = decoded;
            next();
        } catch (error) {
            // Token is invalid, expired, or malformed
            return res.status(401).json({ error: "Invalid token" });
        }
    };
};
