-- Users Table
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'guest')) DEFAULT 'guest'
);

-- Stations Table
DROP TABLE IF EXISTS stations CASCADE;
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    status BOOLEAN DEFAULT TRUE
);

-- Variables Table
DROP TABLE IF EXISTS variables CASCADE;
CREATE TABLE variables (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL
);

-- Measurements Table
DROP TABLE IF EXISTS measurements CASCADE;
CREATE TABLE measurements (
    id SERIAL PRIMARY KEY,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    variable_id VARCHAR(20) REFERENCES variables(id) ON DELETE CASCADE,
    value FLOAT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
