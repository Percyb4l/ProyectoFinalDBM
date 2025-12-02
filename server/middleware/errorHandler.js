// middleware/errorHandler.js

export const errorHandler = (err, req, res, next) => {
    console.error("🔥 ERROR:", err);
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message
    });
};
