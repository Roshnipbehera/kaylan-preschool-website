import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as contactController from "../controllers/contactController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Public, unauthenticated, spam-prone -- rate limit per IP, same pattern as
// admissionRoutes.ts's admissionLimiter.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many enquiries submitted. Please try again later." },
});

router.post("/", contactLimiter, contactController.createContactInquiry);
router.get("/", requireAuth, requireRole("admin"), contactController.listContactInquiries);
router.get("/:id", requireAuth, requireRole("admin"), contactController.getContactInquiryById);

export default router;
