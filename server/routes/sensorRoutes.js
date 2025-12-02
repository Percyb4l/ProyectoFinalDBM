import express from "express";
import {
  getSensorsByStation,
  createSensor
} from "../controllers/sensorController.js";

const router = express.Router();

router.get("/:station_id", getSensorsByStation);
router.post("/", createSensor);

export default router;
