import pool from './config/db.js';

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // 1. Insert Variables
        console.log('📊 Inserting variables...');
        await pool.query(`
      INSERT INTO variables (id, name, unit) VALUES
      ('PM25', 'Material Particulado Fino PM2.5', 'µg/m³'),
      ('PM10', 'Material Particulado PM10', 'µg/m³'),
      ('NO2', 'Dióxido de Nitrógeno', 'ppb'),
      ('O3', 'Ozono', 'ppb'),
      ('CO', 'Monóxido de Carbono', 'ppm'),
      ('TEMP', 'Temperatura', '°C'),
      ('HUM', 'Humedad Relativa', '%'),
      ('WIND', 'Velocidad del Viento', 'm/s')
      ON CONFLICT (id) DO NOTHING
    `);
        console.log('✅ Variables inserted\n');

        // 2. Insert Thresholds
        console.log('⚠️  Inserting thresholds...');
        await pool.query(`
      INSERT INTO thresholds (variable_id, low, medium, high, critical) VALUES
      ('PM25', 12, 35, 55, 150),
      ('PM10', 54, 154, 254, 354),
      ('NO2', 50, 100, 200, 400)
      ON CONFLICT DO NOTHING
    `);
        console.log('✅ Thresholds inserted\n');

        // 3. Insert Institution
        console.log('🏛️  Inserting institution...');
        const instResult = await pool.query(`
      INSERT INTO institutions (name, address, is_verified) 
      VALUES ('DAGMA', 'Cali, Valle del Cauca', TRUE)
      ON CONFLICT DO NOTHING
      RETURNING id
    `);
        const institutionId = instResult.rows[0]?.id || 1;
        console.log(`✅ Institution inserted (ID: ${institutionId})\n`);

        // 4. Insert Stations
        console.log('🏢 Inserting stations...');
        const stationResult = await pool.query(`
      INSERT INTO stations (institution_id, name, latitude, longitude, status) VALUES
      (${institutionId}, 'Estación Centro', 3.4516, -76.5320, 'active'),
      (${institutionId}, 'Estación Norte', 3.4700, -76.5200, 'active'),
      (${institutionId}, 'Estación Sur', 3.4300, -76.5400, 'active')
      ON CONFLICT DO NOTHING
      RETURNING id
    `);
        const stationIds = stationResult.rows.map(r => r.id);
        console.log(`✅ Stations inserted (IDs: ${stationIds.join(', ')})\n`);

        // 5. Insert Sensors
        console.log('📡 Inserting sensors...');
        const sensorResult = await pool.query(`
      INSERT INTO sensors (station_id, model, brand, status) VALUES
      (${stationIds[0] || 1}, 'SEN-A1', 'Honeywell', 'active'),
      (${stationIds[0] || 1}, 'SEN-B2', 'Siemens', 'active'),
      (${stationIds[1] || 2}, 'SEN-C3', 'Honeywell', 'active')
      ON CONFLICT DO NOTHING
      RETURNING id
    `);
        const sensorIds = sensorResult.rows.map(r => r.id);
        console.log(`✅ Sensors inserted (IDs: ${sensorIds.join(', ')})\n`);

        // 6. Insert Sensor Variables
        console.log('🔗 Linking sensors to variables...');
        await pool.query(`
      INSERT INTO sensor_variables (sensor_id, variable_id) VALUES
      (${sensorIds[0] || 1}, 'PM25'),
      (${sensorIds[0] || 1}, 'PM10'),
      (${sensorIds[1] || 2}, 'NO2'),
      (${sensorIds[1] || 2}, 'O3'),
      (${sensorIds[2] || 3}, 'TEMP'),
      (${sensorIds[2] || 3}, 'HUM')
      ON CONFLICT DO NOTHING
    `);
        console.log('✅ Sensor-variable relationships created\n');

        // 7. Insert Sample Measurements
        console.log('📈 Inserting sample measurements...');
        await pool.query(`
      INSERT INTO measurements (station_id, sensor_id, variable_id, value, timestamp) VALUES
      (${stationIds[0] || 1}, ${sensorIds[0] || 1}, 'PM25', 25.5, NOW() - INTERVAL '1 hour'),
      (${stationIds[0] || 1}, ${sensorIds[0] || 1}, 'PM10', 45.2, NOW() - INTERVAL '1 hour'),
      (${stationIds[0] || 1}, ${sensorIds[1] || 2}, 'NO2', 35.8, NOW() - INTERVAL '2 hours'),
      (${stationIds[0] || 1}, ${sensorIds[1] || 2}, 'O3', 42.1, NOW() - INTERVAL '2 hours'),
      (${stationIds[1] || 2}, ${sensorIds[2] || 3}, 'TEMP', 22.5, NOW() - INTERVAL '30 minutes'),
      (${stationIds[1] || 2}, ${sensorIds[2] || 3}, 'HUM', 65.0, NOW() - INTERVAL '30 minutes'),
      (${stationIds[0] || 1}, ${sensorIds[0] || 1}, 'PM25', 28.3, NOW()),
      (${stationIds[0] || 1}, ${sensorIds[0] || 1}, 'PM10', 48.7, NOW())
      ON CONFLICT DO NOTHING
    `);
        console.log('✅ Sample measurements inserted\n');

        // 8. Insert Sample Alerts
        console.log('⚠️  Inserting sample alerts...');
        await pool.query(`
      INSERT INTO alerts (station_id, variable_id, message, severity, is_resolved, created_at) VALUES
      (${stationIds[0] || 1}, 'PM25', 'Nivel de PM2.5 por encima del umbral medio', 'medium', false, NOW() - INTERVAL '3 hours'),
      (${stationIds[0] || 1}, 'PM10', 'Nivel de PM10 en rango normal', 'low', true, NOW() - INTERVAL '5 hours'),
      (${stationIds[1] || 2}, 'NO2', 'Nivel crítico de NO2 detectado', 'critical', false, NOW() - INTERVAL '1 hour')
      ON CONFLICT DO NOTHING
    `);
        console.log('✅ Sample alerts inserted\n');

        console.log('🎉 Database seeding completed successfully!\n');
        console.log('Summary:');
        console.log('  - 8 Variables');
        console.log('  - 3 Thresholds');
        console.log('  - 1 Institution (DAGMA)');
        console.log(`  - ${stationIds.length} Stations`);
        console.log(`  - ${sensorIds.length} Sensors`);
        console.log('  - 6 Sensor-Variable links');
        console.log('  - 8 Sample measurements');
        console.log('  - 3 Sample alerts\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
