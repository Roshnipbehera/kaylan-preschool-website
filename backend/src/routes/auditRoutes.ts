import { Router } from "express";
import * as auditController from "../controllers/auditController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), auditController.listAuditLogs);

export default router;
