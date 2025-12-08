-- =======================================================
-- Migration: Add certificates table
-- Description: Creates certificates table for storing calibration
--              and maintenance certificates for stations
-- Date: 2024
-- =======================================================

-- CERTIFICATES TABLE
CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    sensor_id INTEGER REFERENCES sensors(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    type VARCHAR(50) NOT NULL CHECK (
        type IN ('calibracion', 'mantenimiento')
    ),
    expiration_date DATE,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add comment for documentation
COMMENT ON TABLE certificates IS 'Stores calibration and maintenance certificates for stations and sensors';
COMMENT ON COLUMN certificates.type IS 'Type of certificate: calibracion (calibration) or mantenimiento (maintenance)';
COMMENT ON COLUMN certificates.file_url IS 'URL or path to the stored certificate file';
COMMENT ON COLUMN certificates.expiration_date IS 'Date when the certificate expires (if applicable)';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_certificates_station_id ON certificates(station_id);
CREATE INDEX IF NOT EXISTS idx_certificates_sensor_id ON certificates(sensor_id);
CREATE INDEX IF NOT EXISTS idx_certificates_type ON certificates(type);
CREATE INDEX IF NOT EXISTS idx_certificates_expiration_date ON certificates(expiration_date);

