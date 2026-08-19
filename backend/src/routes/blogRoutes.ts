import { Router } from "express";
import * as blogController from "../controllers/blogController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Public reads
router.get("/authors", blogController.listAuthors);
router.get("/author/:authorSlug", blogController.listByAuthor);
router.get("/", blogController.listPosts);
router.get("/:slug", blogController.getPostBySlug);

// Admin-only writes
router.post("/", requireAuth, requireRole("admin"), blogController.createPost);
router.patch("/:slug", requireAuth, requireRole("admin"), blogController.updatePost);
router.delete("/:slug", requireAuth, requireRole("admin"), blogController.deletePost);

export default router;
