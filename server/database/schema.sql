/******************************************************************************************
    VRISA – SCHEMA.SQL
    Archivo principal del esquema de la base de datos.
    Contiene: creación de tablas, relaciones, claves, restricciones, PostGIS y modelos base.
******************************************************************************************/

-- ===========================
-- 1. Activar PostGIS
-- ===========================
-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    institution_id INTEGER,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (
        role IN (
            'admin_general',
            'admin_institucion',
            'operador_estacion',
            'investigador',
            'ciudadano'
        )
    )
);

-- INSTITUTIONS
CREATE TABLE institutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(200),
    is_verified BOOLEAN DEFAULT false,
    color_primary VARCHAR(20),
    color_secondary VARCHAR(20),
    logo_url TEXT,
    created_by INTEGER
);

-- STATIONS (SIN POSTGIS)
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    institution_id INTEGER REFERENCES institutions(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active'
);

-- SENSORS
CREATE TABLE sensors (
    id SERIAL PRIMARY KEY,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    model VARCHAR(150),
    brand VARCHAR(150),
    status VARCHAR(30) DEFAULT 'active'
);

-- VARIABLES
CREATE TABLE variables (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL
);

-- SENSOR-VARIABLE RELATION
CREATE TABLE sensor_variables (
    id SERIAL PRIMARY KEY,
    sensor_id INTEGER REFERENCES sensors(id) ON DELETE CASCADE,
    variable_id VARCHAR(20) REFERENCES variables(id) ON DELETE CASCADE
);

-- MEASUREMENTS (SIN POSTGIS)
CREATE TABLE measurements (
    id SERIAL PRIMARY KEY,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    sensor_id INTEGER REFERENCES sensors(id) ON DELETE CASCADE,
    variable_id VARCHAR(20) REFERENCES variables(id) ON DELETE CASCADE,
    value DOUBLE PRECISION NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- THRESHOLDS
CREATE TABLE thresholds (
    id SERIAL PRIMARY KEY,
    variable_id VARCHAR(20) REFERENCES variables(id) ON DELETE CASCADE,
    low DOUBLE PRECISION,
    medium DOUBLE PRECISION,
    high DOUBLE PRECISION,
    critical DOUBLE PRECISION
);

-- ALERTS
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    variable_id VARCHAR(20) REFERENCES variables(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    severity VARCHAR(20) CHECK (
        severity IN ('low','medium','high','critical')
    ),
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- REPORTS
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    generated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INTEGRATION REQUESTS
CREATE TABLE integration_requests (
    id SERIAL PRIMARY KEY,
    institution_id INTEGER REFERENCES institutions(id) ON DELETE SET NULL,
    station_name VARCHAR(150) NOT NULL,
    requested_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP
);

