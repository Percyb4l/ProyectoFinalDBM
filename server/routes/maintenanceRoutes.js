import express from "express";
import {
  createMaintenance,
  getMaintenanceByStation
} from "../controllers/maintenanceController.js";

const router = express.Router();

router.post("/", createMaintenance);
router.get("/:station_id", getMaintenanceByStation);

export default router;
