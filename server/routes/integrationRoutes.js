import express from "express";
import {
  createIntegrationRequest,
  approveIntegration,
  rejectIntegration,
  getIntegrationRequests
} from "../controllers/integrationController.js";

const router = express.Router();

router.get("/", getIntegrationRequests);
router.post("/", createIntegrationRequest);
router.put("/:id/approve", approveIntegration);
router.put("/:id/reject", rejectIntegration);

export default router;
