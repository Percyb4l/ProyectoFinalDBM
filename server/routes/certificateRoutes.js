import express from "express";
import {
  uploadCertificate,
  getCertificatesByStation
} from "../controllers/certificateController.js";

const router = express.Router();

router.post("/", uploadCertificate);
router.get("/:station_id", getCertificatesByStation);

export default router;
