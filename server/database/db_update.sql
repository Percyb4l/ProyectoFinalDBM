-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    variable_id VARCHAR(20) REFERENCES variables(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    severity VARCHAR(20) CHECK (
        severity IN ('low', 'medium', 'high', 'critical')
    ) DEFAULT 'medium',
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);
-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    generated_by INTEGER REFERENCES users(id) ON DELETE
    SET NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_path VARCHAR(255),
        -- Path to the generated PDF/CSV file
        report_type VARCHAR(50) CHECK (report_type IN ('daily', 'monthly', 'custom')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Maintenance Logs Table
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id SERIAL PRIMARY KEY,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    performed_by INTEGER REFERENCES users(id) ON DELETE
    SET NULL,
        description TEXT NOT NULL,
        maintenance_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        next_maintenance_date TIMESTAMP,
        status VARCHAR(50) CHECK (status IN ('scheduled', 'completed', 'pending')) DEFAULT 'completed'
);
-- Indexes
CREATE INDEX idx_alerts_station ON alerts(station_id);
CREATE INDEX idx_alerts_resolved ON alerts(is_resolved);
CREATE INDEX idx_reports_user ON reports(generated_by);
CREATE INDEX idx_maintenance_station ON maintenance_logs(station_id);