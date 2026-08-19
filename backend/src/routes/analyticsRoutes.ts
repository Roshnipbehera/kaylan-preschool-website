import { Router } from "express";
import * as analyticsController from "../controllers/analyticsController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/stats", requireAuth, requireRole("admin"), analyticsController.getStats);

export default router;
