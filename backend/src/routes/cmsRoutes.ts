import { Router } from "express";
import * as cmsController from "../controllers/cmsController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), cmsController.listCmsSections);
router.get("/:sectionKey", cmsController.getCmsSection);
router.put("/:sectionKey", requireAuth, requireRole("admin"), cmsController.updateCmsSection);

export default router;
