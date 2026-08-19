import { Router } from "express";
import * as activityController from "../controllers/activityController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, activityController.listActivityLogs);
router.post("/", requireAuth, requireRole("teacher", "admin"), activityController.createActivityLog);

export default router;
