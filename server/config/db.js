// server/config/db.js
// =========================================
// Conexión a PostgreSQL usando ES Modules
// =========================================

import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "vrisa_db",
    port: process.env.DB_PORT || 5432
});

// Test de conexión
pool.connect()
    .then(() => console.log("📡 PostgreSQL conectado correctamente"))
    .catch(err => console.error("❌ Error conectando a la BD:", err));

// 🔥 ESTE ES EL PUNTO QUE TE FALTABA
export default pool;