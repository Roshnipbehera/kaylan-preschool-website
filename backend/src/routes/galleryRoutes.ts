import { Router } from "express";
import * as galleryController from "../controllers/galleryController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", galleryController.listAlbums);
router.get("/:id", galleryController.getAlbum);
router.post("/", requireAuth, requireRole("admin"), galleryController.createAlbum);
router.patch("/:id", requireAuth, requireRole("admin"), galleryController.updateAlbum);
router.delete("/:id", requireAuth, requireRole("admin"), galleryController.deleteAlbum);

export default router;
