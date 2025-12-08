-- =======================================================
-- Migration: Add technician_id to stations table
-- Description: Adds responsible_user_id column to stations
--              to track the technical responsible person
-- Date: 2024
-- =======================================================

-- Add technician_id column (nullable, as existing stations may not have one)
ALTER TABLE stations 
ADD COLUMN technician_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Add comment for documentation
COMMENT ON COLUMN stations.technician_id IS 'ID of the user responsible for technical maintenance of this station';

-- Optional: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_stations_technician_id ON stations(technician_id);

