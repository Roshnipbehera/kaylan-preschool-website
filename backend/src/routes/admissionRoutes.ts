import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as admissionController from "../controllers/admissionController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Public, unauthenticated, spam-prone -- rate limit submissions per IP.
const admissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many applications submitted. Please try again later." },
});

router.post("/", admissionLimiter, admissionController.createAdmission);
router.get("/", requireAuth, requireRole("admin"), admissionController.listAdmissions);
router.get("/:id", requireAuth, admissionController.getAdmissionById);
router.patch("/:id/status", requireAuth, requireRole("admin"), admissionController.updateAdmissionStatus);

export default router;
