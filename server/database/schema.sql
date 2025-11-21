-- Users table for authentication and authorization
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'public')) DEFAULT 'public',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stations table
CREATE TABLE IF NOT EXISTS stations (
    station_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255), -- Can be GeoJSON or simple text description
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'maintenance')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Variables table (Pollutants or meteorological variables)
CREATE TABLE IF NOT EXISTS variables (
    variable_id VARCHAR(20) PRIMARY KEY, -- e.g., 'PM10', 'CO2'
    character VARCHAR(100) NOT NULL, -- Name/Description
    unit_of_measurement VARCHAR(20) NOT NULL
);

-- Measurements table
CREATE TABLE IF NOT EXISTS measurements (
    measurement_id SERIAL PRIMARY KEY,
    station_id INTEGER REFERENCES stations(station_id),
    variable_id VARCHAR(20) REFERENCES variables(variable_id),
    value DECIMAL(10, 4) NOT NULL,
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_measurements_station_variable ON measurements(station_id, variable_id);
CREATE INDEX idx_measurements_date ON measurements(measured_at);
