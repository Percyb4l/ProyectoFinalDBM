/******************************************************************************************
    VRISA – DB_UPDATE.SQL
    Archivo para:
    - Datos iniciales (seeders)
    - Inserts de prueba
    - Alteraciones posteriores al esquema
******************************************************************************************/

-- ===========================================
-- INSERTS DE VARIABLES AMBIENTALES BASE
-- ===========================================
INSERT INTO variables (id, name, unit, description) VALUES
('PM25', 'Material Particulado Fino PM2.5', 'µg/m3', 'Partículas < 2.5µm'),
('PM10', 'Material Particulado PM10', 'µg/m3', 'Partículas < 10µm'),
('NO2', 'Dióxido de Nitrógeno', 'ppb', 'Gas tóxico'),
('O3', 'Ozono', 'ppb', 'Gas troposférico'),
('CO', 'Monóxido de Carbono', 'ppm', 'Gas tóxico'),
('TEMP', 'Temperatura', '°C', 'Variable meteorológica'),
('HUM', 'Humedad Relativa', '%', 'Variable meteorológica'),
('WIND', 'Velocidad del Viento', 'm/s', 'Variable meteorológica');

-- ===========================================
-- INSERTS DE UMBRALES (EJEMPLO)
-- ===========================================
INSERT INTO thresholds (variable_id, low, medium, high, critical) VALUES
('PM25', 12, 35, 55, 150),
('PM10', 54, 154, 254, 354),
('NO2', 50, 100, 200, 400);

-- ===========================================
-- INSERTS DE INSTITUCIÓN DEMO
-- ===========================================
INSERT INTO institutions (name, address, is_verified) VALUES
('DAGMA', 'Cali, Valle del Cauca', TRUE);

-- ===========================================
-- INSERTS DE USUARIO ADMIN
-- ===========================================
INSERT INTO users (institution_id, name, email, password, role) VALUES
(1, 'Administrador General', 'admin@vrisa.com', '123456', 'admin_general');

-- ===========================================
-- EJEMPLO DE ESTACIÓN (CALI)
-- ===========================================
INSERT INTO stations (institution_id, name, location) VALUES
(1, 'Estación Centro', ST_SetSRID(ST_MakePoint(-76.5320, 3.4516), 4326));

-- ===========================================
-- EJEMPLO DE SENSOR
-- ===========================================
INSERT INTO sensors (station_id, model, brand) VALUES
(1, 'SEN-A1', 'Honeywell');

-- ===========================================
-- SENSOR MIDE VARIABLES
-- ===========================================
INSERT INTO sensor_variables (sensor_id, variable_id) VALUES
(1, 'PM25'),
(1, 'PM10');
