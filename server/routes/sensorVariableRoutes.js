import express from "express";
import {
  assignVariableToSensor
} from "../controllers/sensorVariableController.js";

const router = express.Router();

router.post("/", assignVariableToSensor);

export default router;
