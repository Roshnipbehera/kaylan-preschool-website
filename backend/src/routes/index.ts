import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import conversationRoutes from "./conversationRoutes";
import messageRoutes from "./messageRoutes";
import studentRoutes from "./studentRoutes";
import attendanceRoutes from "./attendanceRoutes";
import homeworkRoutes from "./homeworkRoutes";
// admissionRoutes/activityRoutes/announcementRoutes/cmsRoutes are the
// live Prisma-backed Batch 2 migration routers. eventRoutes/blogRoutes/
// galleryRoutes are the live Prisma-backed Batch 3 migration routers (see
// their respective controllers). eventController.ts previously wrapped a
// legacy Mongoose-backed scaffold (../models/Event.ts, ../models/Rsvp.ts)
// that would 500 at runtime without a MONGODB_URI; it has been rewritten
// to use Prisma/Postgres like every other live domain. The old Mongoose
// model files are left in place as harmless dead code -- nothing imports
// them any more.
import admissionRoutes from "./admissionRoutes";
import activityRoutes from "./activityRoutes";
import announcementRoutes from "./announcementRoutes";
import cmsRoutes from "./cmsRoutes";
import eventRoutes from "./eventRoutes";
import blogRoutes from "./blogRoutes";
import galleryRoutes from "./galleryRoutes";
// feesRoutes/notificationRoutes/analyticsRoutes/auditRoutes/settingsRoutes
// are the live Prisma-backed Batch 4 (FINAL) migration routers.
import feesRoutes from "./feesRoutes";
import notificationRoutes from "./notificationRoutes";
import analyticsRoutes from "./analyticsRoutes";
import auditRoutes from "./auditRoutes";
import settingsRoutes from "./settingsRoutes";
// contactRoutes -- deployment-blocker fix pass. Backs the public marketing
// site's Contact.tsx enquiry form, which previously had no onSubmit handler
// at all (see FINAL_ACCEPTANCE_REPORT.md section 3).
import contactRoutes from "./contactRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);
router.use("/students", studentRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/homework", homeworkRoutes);
router.use("/admissions", admissionRoutes);
router.use("/activities", activityRoutes);
router.use("/announcements", announcementRoutes);
router.use("/cms", cmsRoutes);
router.use("/events", eventRoutes);
router.use("/blog", blogRoutes);
router.use("/gallery", galleryRoutes);
router.use("/fees", feesRoutes);
router.use("/notifications", notificationRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/audit", auditRoutes);
router.use("/settings", settingsRoutes);
router.use("/contact", contactRoutes);

export default router;
