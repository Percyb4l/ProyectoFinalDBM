// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const requireAuth = (roles = []) => {
    return (req, res, next) => {
        const header = req.headers.authorization;
        const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : null;

        if (!token)
            return res.status(401).json({ error: "No token provided" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Si se pasan roles y el rol del usuario no está en la lista → 403
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ error: "Forbidden" });
            }

            req.user = decoded; // { id, role, ... }
            next();
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    };
};
