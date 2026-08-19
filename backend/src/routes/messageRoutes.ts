import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as messageController from "../controllers/messageController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

// Message sends are the highest-frequency write in the app -- rate limit
// separately from the global limiter.
const sendLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false });

router.get("/search", messageController.searchMessages);
router.post("/", sendLimiter, messageController.sendMessage);
router.patch("/:id", messageController.editMessage);
router.delete("/:id", messageController.deleteMessage);
router.patch("/:id/pin", messageController.pinMessage);
router.post("/:id/reactions", messageController.reactToMessage);
router.delete("/:id/reactions/:emoji", messageController.removeReaction);

export default router;
