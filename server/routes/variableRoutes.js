import express from "express";
import {
  getVariables,
  createVariable
} from "../controllers/variableController.js";

const router = express.Router();

router.get("/", getVariables);
router.post("/", createVariable);

export default router;
