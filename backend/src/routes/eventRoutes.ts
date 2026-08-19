import { Router } from "express";
import * as eventController from "../controllers/eventController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", eventController.listEvents);
router.get("/:id", eventController.getEventById);
router.post("/", requireAuth, requireRole("admin"), eventController.createEvent);
router.patch("/:id", requireAuth, requireRole("admin"), eventController.updateEvent);
router.delete("/:id", requireAuth, requireRole("admin"), eventController.deleteEvent);
router.post("/:id/rsvp", eventController.createRsvp);
router.get("/:id/rsvp", requireAuth, requireRole("admin"), eventController.listRsvps);

export default router;
