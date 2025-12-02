import express from "express";
import {
  createThreshold,
  getThresholds
} from "../controllers/thresholdController.js";

const router = express.Router();

router.post("/", createThreshold);
router.get("/", getThresholds);

export default router;
