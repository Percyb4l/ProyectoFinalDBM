import express from "express";
import {
  createReport,
  getReports
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/", getReports);
router.post("/", createReport);

export default router;
