/**
 * @fileoverview Multer Configuration
 * 
 * Configures multer middleware for handling file uploads.
 * Supports PDF and image files for certificates.
 * 
 * @module config/multer
 */

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync } from "fs";

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload directory
const uploadsDir = path.join(__dirname, "..", "uploads", "certificates");

// Create uploads directory if it doesn't exist
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const sanitizedBasename = basename.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    cb(null, `${sanitizedBasename}-${uniqueSuffix}${ext}`);
  },
});

// File filter - only allow PDF and image files
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Tipo de archivo no permitido. Solo se permiten PDF e imágenes (JPEG, PNG, GIF, WEBP)"
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

/**
 * Middleware for uploading a single certificate file
 * Field name: 'certificate'
 */
export const uploadCertificate = upload.single("certificate");

/**
 * Middleware for uploading multiple certificate files
 * Field name: 'certificates'
 */
export const uploadCertificates = upload.array("certificates", 10);

export default upload;

