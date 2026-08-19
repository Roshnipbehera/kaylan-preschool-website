import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Auth endpoints are the most brute-forceable surface in the app -- keep a
// tight rate limit on login/register/forgot-password specifically (as
// opposed to the looser global limiter applied in app.ts).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later." },
});

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authLimiter, authController.resetPassword);
router.get("/verify-email", authController.verifyEmail);
router.get("/me", requireAuth, authController.me);

export default router;
