import { Router } from "express";
import * as attendanceController from "../controllers/attendanceController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, attendanceController.listAttendance);
router.post("/", requireAuth, requireRole("teacher", "admin"), attendanceController.bulkMarkAttendance);

export default router;
