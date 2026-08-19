import { Router } from "express";
import * as announcementController from "../controllers/announcementController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, announcementController.listAnnouncements);
router.post("/", requireAuth, requireRole("teacher", "admin"), announcementController.createAnnouncement);

export default router;
