/**
 * @fileoverview Database Seeding Script
 * 
 * Script para poblar la base de datos con datos de prueba realistas.
 * Genera instituciones, usuarios, estaciones, sensores, variables, mediciones y alertas.
 * 
 * @module database/seed_database
 * @requires pg
 * @requires dotenv
 */

import pkg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config();

const { Pool } = pkg;

/**
 * PostgreSQL connection pool
 */
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "vrisa_db",
  port: process.env.DB_PORT || 5432,
});

/**
 * Helper function to generate random number in range
 */
const random = (min, max) => Math.random() * (max - min) + min;

/**
 * Helper function to generate random integer in range
 */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Helper function to select random element from array
 */
const randomElement = (array) => array[randomInt(0, array.length - 1)];

/**
 * Helper function to generate random date in the past
 */
const randomDate = (daysAgo) => {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const randomTime = Math.random() * (now.getTime() - past.getTime()) + past.getTime();
  return new Date(randomTime);
};

/**
 * Main seeding function
 */
async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log("🌱 Iniciando proceso de seeding...\n");

    // ============================================
    // 1. LIMPIEZA DE DATOS EXISTENTES
    // ============================================
    console.log("🧹 Limpiando datos existentes...");
    
    await client.query("TRUNCATE TABLE certificates RESTART IDENTITY CASCADE");
    await client.query("TRUNCATE TABLE integration_requests RESTART IDENTITY CASCADE");
    await client.query("TRUNCATE TABLE reports RESTART IDENTITY CASCADE");
    await client.query("TRUNCATE TABLE alerts RESTART IDENTITY CASCADE");
    await client.query("TRUNCATE TABLE thresholds RESTART IDENTITY CASCADE");
    await client.query("TRUNCATE TABLE measurements RESTART IDENTITY CASCADE");
    await client.query("TRUNCATE TABLE sensor_variables RESTART IDENTITY CASCADE");
    await client.query("TRUNCATE TABLE sensors RESTART IDENTITY CASCADE");
    await client.query("TRUNCATE TABLE stations RESTART IDENTITY CASCADE");
    await client.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
    await client.query("TRUNCATE TABLE institutions RESTART IDENTITY CASCADE");
    await client.query("TRUNCATE TABLE variables RESTART IDENTITY CASCADE");
    
    console.log("✅ Limpieza completada\n");

    // ============================================
    // 2. DATOS MAESTROS - VARIABLES
    // ============================================
    console.log("📊 Creando variables ambientales...");
    
    const variables = [
      { id: "PM25", name: "Material Particulado PM2.5", unit: "µg/m³" },
      { id: "PM10", name: "Material Particulado PM10", unit: "µg/m³" },
      { id: "O3", name: "Ozono", unit: "ppb" },
      { id: "TEMP", name: "Temperatura", unit: "°C" },
    ];

    for (const variable of variables) {
      await client.query(
        "INSERT INTO variables (id, name, unit) VALUES ($1, $2, $3)",
        [variable.id, variable.name, variable.unit]
      );
    }
    
    console.log(`✅ ${variables.length} variables creadas\n`);

    // ============================================
    // 3. DATOS MAESTROS - INSTITUCIONES
    // ============================================
    console.log("🏛️ Creando instituciones...");
    
    const institutions = [
      {
        name: "Secretaría de Ambiente de Cali",
        address: "Calle 5 # 3-14, Santiago de Cali, Valle del Cauca",
        is_verified: true,
        color_primary: "#0066CC",
        color_secondary: "#00A8E8",
        logo_url: null,
      },
      {
        name: "Universidad del Valle",
        address: "Calle 13 # 100-00, Santiago de Cali, Valle del Cauca",
        is_verified: true,
        color_primary: "#8B0000",
        color_secondary: "#DC143C",
        logo_url: null,
      },
      {
        name: "Corporación Autónoma Regional del Valle del Cauca (CVC)",
        address: "Carrera 56 # 11-36, Santiago de Cali, Valle del Cauca",
        is_verified: true,
        color_primary: "#228B22",
        color_secondary: "#32CD32",
        logo_url: null,
      },
    ];

    const institutionIds = [];
    for (const inst of institutions) {
      const result = await client.query(
        `INSERT INTO institutions (name, address, is_verified, color_primary, color_secondary, logo_url)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [inst.name, inst.address, inst.is_verified, inst.color_primary, inst.color_secondary, inst.logo_url]
      );
      institutionIds.push(result.rows[0].id);
    }
    
    console.log(`✅ ${institutions.length} instituciones creadas\n`);

    // ============================================
    // 4. DATOS MAESTROS - USUARIOS
    // ============================================
    console.log("👥 Creando usuarios...");
    
    const hashedPassword = await bcrypt.hash("123456", 10);
    
    const users = [
      {
        name: "Administrador General",
        email: "admin@vrisa.com",
        password: hashedPassword,
        role: "admin_general",
        institution_id: null,
      },
      {
        name: "María González",
        email: "maria.gonzalez@cali.gov.co",
        password: hashedPassword,
        role: "admin_institucion",
        institution_id: institutionIds[0],
      },
      {
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@univalle.edu.co",
        password: hashedPassword,
        role: "admin_institucion",
        institution_id: institutionIds[1],
      },
      {
        name: "Juan Pérez",
        email: "juan.perez@operador.com",
        password: hashedPassword,
        role: "operador_estacion",
        institution_id: institutionIds[0],
      },
      {
        name: "Ana Martínez",
        email: "ana.martinez@ciudadano.com",
        password: hashedPassword,
        role: "ciudadano",
        institution_id: null,
      },
    ];

    const userIds = [];
    for (const user of users) {
      const result = await client.query(
        `INSERT INTO users (name, email, password, role, institution_id)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [user.name, user.email, user.password, user.role, user.institution_id]
      );
      userIds.push(result.rows[0].id);
    }
    
    console.log(`✅ ${users.length} usuarios creados\n`);

    // ============================================
    // 5. INFRAESTRUCTURA - ESTACIONES
    // ============================================
    console.log("🏢 Creando estaciones de monitoreo...");
    
    // Coordenadas reales de Santiago de Cali, Valle del Cauca
    const stations = [
      {
        name: "Estación Centro - Plaza de Cayzedo",
        latitude: 3.4516,
        longitude: -76.5320,
        status: "active",
        institution_id: institutionIds[0],
      },
      {
        name: "Estación Norte - Universidad del Valle",
        latitude: 3.3750,
        longitude: -76.5300,
        status: "active",
        institution_id: institutionIds[1],
      },
      {
        name: "Estación Sur - Comuna 20",
        latitude: 3.4000,
        longitude: -76.5500,
        status: "active",
        institution_id: institutionIds[0],
      },
      {
        name: "Estación Occidente - Comuna 18",
        latitude: 3.4500,
        longitude: -76.5800,
        status: "active",
        institution_id: institutionIds[2],
      },
      {
        name: "Estación Oriente - Comuna 1",
        latitude: 3.4500,
        longitude: -76.4800,
        status: "maintenance",
        institution_id: institutionIds[2],
      },
    ];

    const stationIds = [];
    for (const station of stations) {
      const result = await client.query(
        `INSERT INTO stations (name, latitude, longitude, status, institution_id)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [station.name, station.latitude, station.longitude, station.status, station.institution_id]
      );
      stationIds.push(result.rows[0].id);
    }
    
    console.log(`✅ ${stations.length} estaciones creadas\n`);

    // ============================================
    // 6. INFRAESTRUCTURA - SENSORES
    // ============================================
    console.log("📡 Creando sensores...");
    
    const sensorBrands = ["Aeroqual", "Vaisala", "Met One", "Thermo Scientific", "Ecotech"];
    const sensorModels = ["Series 500", "AQT420", "BAM-1020", "iSeries", "EC9810"];
    const sensorStatuses = ["active", "active", "active", "maintenance"]; // Más probabilidad de activos
    
    const sensorIds = [];
    let sensorCount = 0;
    
    for (const stationId of stationIds) {
      // Crear 2-3 sensores por estación
      const numSensors = randomInt(2, 3);
      
      for (let i = 0; i < numSensors; i++) {
        const result = await client.query(
          `INSERT INTO sensors (station_id, model, brand, status)
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [
            stationId,
            randomElement(sensorModels),
            randomElement(sensorBrands),
            randomElement(sensorStatuses),
          ]
        );
        sensorIds.push(result.rows[0].id);
        sensorCount++;
      }
    }
    
    console.log(`✅ ${sensorCount} sensores creados\n`);

    // ============================================
    // 7. RELACIONES SENSOR-VARIABLE
    // ============================================
    console.log("🔗 Asociando variables a sensores...");
    
    const variableIds = ["PM25", "PM10", "O3", "TEMP"];
    let associationCount = 0;
    
    for (const sensorId of sensorIds) {
      // Cada sensor mide 1-3 variables aleatorias
      const numVariables = randomInt(1, 3);
      const selectedVariables = [];
      
      while (selectedVariables.length < numVariables) {
        const varId = randomElement(variableIds);
        if (!selectedVariables.includes(varId)) {
          selectedVariables.push(varId);
        }
      }
      
      for (const varId of selectedVariables) {
        await client.query(
          "INSERT INTO sensor_variables (sensor_id, variable_id) VALUES ($1, $2)",
          [sensorId, varId]
        );
        associationCount++;
      }
    }
    
    console.log(`✅ ${associationCount} asociaciones sensor-variable creadas\n`);

    // ============================================
    // 8. GENERACIÓN MASIVA - MEDICIONES
    // ============================================
    console.log("📈 Generando mediciones históricas (últimos 100 días)...");
    console.log("   Esto puede tomar unos momentos...\n");
    
    const measurementsPerDay = 10; // ~10 mediciones por día por sensor
    const totalDays = 100;
    const totalMeasurements = sensorIds.length * measurementsPerDay * totalDays;
    
    let measurementCount = 0;
    const batchSize = 100; // Insertar en lotes de 100
    
    // Rangos realistas por variable
    const valueRanges = {
      PM25: { min: 5, max: 60 },
      PM10: { min: 10, max: 120 },
      O3: { min: 20, max: 150 },
      TEMP: { min: 8, max: 28 },
    };
    
    for (const sensorId of sensorIds) {
      // Obtener variables asociadas a este sensor
      const varResult = await client.query(
        "SELECT variable_id FROM sensor_variables WHERE sensor_id = $1",
        [sensorId]
      );
      const sensorVariables = varResult.rows.map((row) => row.variable_id);
      
      if (sensorVariables.length === 0) continue;
      
      // Obtener station_id del sensor
      const stationResult = await client.query(
        "SELECT station_id FROM sensors WHERE id = $1",
        [sensorId]
      );
      const stationId = stationResult.rows[0].station_id;
      
      // Generar mediciones para los últimos 100 días
      for (let day = 0; day < totalDays; day++) {
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() - (totalDays - day));
        
        // Generar ~10 mediciones por día
        for (let i = 0; i < measurementsPerDay; i++) {
          const variableId = randomElement(sensorVariables);
          const range = valueRanges[variableId] || { min: 0, max: 100 };
          const value = random(range.min, range.max);
          
          // Timestamp aleatorio dentro del día
          const timestamp = new Date(baseDate);
          timestamp.setHours(randomInt(0, 23));
          timestamp.setMinutes(randomInt(0, 59));
          timestamp.setSeconds(randomInt(0, 59));
          
          await client.query(
            `INSERT INTO measurements (station_id, sensor_id, variable_id, value, timestamp)
             VALUES ($1, $2, $3, $4, $5)`,
            [stationId, sensorId, variableId, Math.round(value * 100) / 100, timestamp]
          );
          
          measurementCount++;
          
          // Mostrar progreso cada 100 mediciones
          if (measurementCount % 100 === 0) {
            process.stdout.write(`   Progreso: ${measurementCount}/${totalMeasurements} mediciones...\r`);
          }
        }
      }
    }
    
    console.log(`\n✅ ${measurementCount} mediciones creadas\n`);

    // ============================================
    // 9. UMBRALES (THRESHOLDS)
    // ============================================
    console.log("⚠️ Creando umbrales de alerta...");
    
    const thresholds = [
      { variable_id: "PM25", low: 12, medium: 35, high: 55, critical: 150 },
      { variable_id: "PM10", low: 54, medium: 154, high: 254, critical: 354 },
      { variable_id: "O3", low: 50, medium: 100, high: 200, critical: 400 },
      { variable_id: "TEMP", low: 10, medium: 20, high: 30, critical: 40 },
    ];

    for (const threshold of thresholds) {
      await client.query(
        `INSERT INTO thresholds (variable_id, low, medium, high, critical)
         VALUES ($1, $2, $3, $4, $5)`,
        [threshold.variable_id, threshold.low, threshold.medium, threshold.high, threshold.critical]
      );
    }
    
    console.log(`✅ ${thresholds.length} umbrales creados\n`);

    // ============================================
    // 10. ALERTAS
    // ============================================
    console.log("🚨 Generando alertas...");
    
    const severities = ["low", "medium", "high", "critical"];
    const alertMessages = {
      PM25: [
        "Nivel de PM2.5 elevado",
        "Concentración de material particulado fino por encima del umbral",
        "Alerta por calidad del aire - PM2.5",
      ],
      PM10: [
        "Nivel de PM10 elevado",
        "Concentración de material particulado por encima del umbral",
        "Alerta por calidad del aire - PM10",
      ],
      O3: [
        "Nivel de ozono elevado",
        "Concentración de ozono troposférico por encima del umbral",
        "Alerta por calidad del aire - Ozono",
      ],
      TEMP: [
        "Temperatura fuera de rango normal",
        "Variación térmica significativa detectada",
        "Alerta meteorológica - Temperatura",
      ],
    };
    
    let alertCount = 0;
    
    for (let i = 0; i < 10; i++) {
      const stationId = randomElement(stationIds);
      const variableId = randomElement(variableIds);
      const severity = randomElement(severities);
      const message = randomElement(alertMessages[variableId] || ["Alerta generada"]);
      const isResolved = Math.random() > 0.4; // 60% resueltas
      const createdAt = randomDate(30); // Últimos 30 días
      const resolvedAt = isResolved ? randomDate(15) : null;
      
      await client.query(
        `INSERT INTO alerts (station_id, variable_id, message, severity, is_resolved, created_at, resolved_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [stationId, variableId, message, severity, isResolved, createdAt, resolvedAt]
      );
      
      alertCount++;
    }
    
    console.log(`✅ ${alertCount} alertas creadas\n`);

    // ============================================
    // RESUMEN FINAL
    // ============================================
    console.log("=".repeat(50));
    console.log("✅ SEEDING COMPLETADO EXITOSAMENTE");
    console.log("=".repeat(50));
    console.log(`📊 Variables: ${variables.length}`);
    console.log(`🏛️ Instituciones: ${institutions.length}`);
    console.log(`👥 Usuarios: ${users.length}`);
    console.log(`🏢 Estaciones: ${stations.length}`);
    console.log(`📡 Sensores: ${sensorCount}`);
    console.log(`🔗 Asociaciones sensor-variable: ${associationCount}`);
    console.log(`📈 Mediciones: ${measurementCount}`);
    console.log(`⚠️ Umbrales: ${thresholds.length}`);
    console.log(`🚨 Alertas: ${alertCount}`);
    console.log(`📦 TOTAL DE REGISTROS: ${variables.length + institutions.length + users.length + stations.length + sensorCount + associationCount + measurementCount + thresholds.length + alertCount}`);
    console.log("=".repeat(50));

  } catch (error) {
    console.error("❌ Error durante el seeding:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
    console.log("\n🔌 Conexión a la base de datos cerrada");
  }
}

// Ejecutar el seeding
seedDatabase()
  .then(() => {
    console.log("\n🎉 Proceso finalizado correctamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Error fatal:", error);
    process.exit(1);
  });

