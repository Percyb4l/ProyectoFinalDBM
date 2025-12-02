import express from "express";
import {
  createInstitution,
  getInstitutions,
  verifyInstitution
} from "../controllers/institutionController.js";

const router = express.Router();

router.get("/", getInstitutions);
router.post("/", createInstitution);
router.put("/:id/verify", verifyInstitution);

export default router;
