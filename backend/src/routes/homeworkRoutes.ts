import { Router } from "express";
import * as homeworkController from "../controllers/homeworkController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, homeworkController.listHomework);
router.post("/", requireAuth, requireRole("teacher", "admin"), homeworkController.createHomework);
// PATCH is shared by the parent-facing "mark submitted" status-only update
// and the teacher full-edit flow -- both just pass a partial body, and
// updateHomeworkFullSchema.partial() accepts either shape identically, so
// no separate route/handler split is needed (RBAC: any authenticated role
// may PATCH; teacher/admin send full edits, parent sends status-only).
router.patch("/:id", requireAuth, homeworkController.updateHomework);
router.delete("/:id", requireAuth, requireRole("teacher", "admin"), homeworkController.deleteHomework);

export default router;
