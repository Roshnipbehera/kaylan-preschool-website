import { Router } from "express";
import * as settingsController from "../controllers/settingsController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Public, unauthenticated -- must be registered before the auth-guarded
// "/" route so it doesn't get shadowed. Returns only non-secret fields.
router.get("/public", settingsController.getPublicSettings);

router.get("/", requireAuth, requireRole("admin"), settingsController.getSettings);
router.put("/", requireAuth, requireRole("admin"), settingsController.saveSettings);

export default router;
