import { Router } from "express";
import multer from "multer";
import * as userController from "../controllers/userController";
import { requireAuth, requireRole } from "../middleware/auth";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

router.get("/me", requireAuth, userController.getProfile);
router.patch("/me", requireAuth, userController.updateProfile);
router.patch("/me/password", requireAuth, userController.changePassword);
router.patch("/me/settings", requireAuth, userController.updateSettings);
router.post("/me/avatar", requireAuth, upload.single("avatar"), userController.uploadAvatar);

// Admin-only user management CRUD (Part 2 of this pass). Registered after
// the /me routes above; Express matches in declaration order so "/me" never
// falls through to the "/:id" handler below.
router.get("/", requireAuth, requireRole("admin"), userController.listUsers);
router.post("/", requireAuth, requireRole("admin"), userController.createUser);
router.get("/:id", requireAuth, requireRole("admin"), userController.getUserById);
router.patch("/:id", requireAuth, requireRole("admin"), userController.updateUser);
router.delete("/:id", requireAuth, requireRole("admin"), userController.deactivateUser);

export default router;
