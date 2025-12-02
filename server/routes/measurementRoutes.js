import express from "express";
import {
  createMeasurement,
  getMeasurementsByStation,
  getMeasurementsBySensor
} from "../controllers/measurementController.js";

const router = express.Router();

router.post("/", createMeasurement);
router.get("/station/:id", getMeasurementsByStation);
router.get("/sensor/:id", getMeasurementsBySensor);

export default router;
