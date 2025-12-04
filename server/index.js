// index.js
// =======================================================
// Punto de entrada del backend VRISA (Express + Postgres)
// =======================================================


import express from "express";
import cors from "cors";
import "./config/db.js"; // solo para inicializar conexión y logs


// Middlewares
import { errorHandler } from "./middleware/errorHandler.js";


// Rutas
import stationRoutes from "./routes/stationRoutes.js";
import measurementRoutes from "./routes/measurementRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import institutionRoutes from "./routes/institutionRoutes.js";
import thresholdRoutes from "./routes/thresholdRoutes.js";
import integrationRoutes from "./routes/integrationRoutes.js";


const app = express();


// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta raíz para verificar estado
app.get("/", (req, res) => {
    res.send("Backend VRISA is running!");
});


// Rutas API (prefijo /api/...)
app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/thresholds", thresholdRoutes);
app.use("/api/integrations", integrationRoutes);


// Middleware de manejo global de errores (SIEMPRE al final)
app.use(errorHandler);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Backend VRISA corriendo en puerto ${PORT}`);
});
