import express from "express";
import {
  getAllStations,
  createStation,
  updateStation,
  deleteStation
} from "../controllers/stationController.js";

const router = express.Router();

router.get("/", getAllStations);
router.post("/", createStation);
router.put("/:id", updateStation);
router.delete("/:id", deleteStation);

export default router;
