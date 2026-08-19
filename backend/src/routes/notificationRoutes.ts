import { Router } from "express";
import * as notificationController from "../controllers/notificationController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, notificationController.listNotifications);
router.patch("/:id/read", requireAuth, notificationController.markRead);
router.post("/read-all", requireAuth, notificationController.markAllRead);

export default router;
