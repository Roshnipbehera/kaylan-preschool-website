import { Router } from "express";
import * as studentController from "../controllers/studentController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Read access: any authenticated role -- controller scopes rows by
// req.user for parent/teacher, admin sees everything (or filters by query).
router.get("/", requireAuth, studentController.listStudents);
router.get("/:id", requireAuth, studentController.getStudent);

// Update access: parent/teacher may edit their own linked student's
// guardian/medical fields (enforced in controller); admin may edit any
// field including reassigning parent/teacher/class.
router.patch("/:id", requireAuth, studentController.updateStudent);

// Admin-only: create/delete full student records.
router.post("/", requireAuth, requireRole("admin"), studentController.createStudent);
router.delete("/:id", requireAuth, requireRole("admin"), studentController.deleteStudent);

export default router;
