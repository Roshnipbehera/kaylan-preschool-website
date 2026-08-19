import { Router } from "express";
import * as conversationController from "../controllers/conversationController";
import * as messageController from "../controllers/messageController";
import { requireAuth } from "../middleware/auth";
import { messageAttachmentUpload } from "../security/upload";

const router = Router();
router.use(requireAuth);

router.get("/", conversationController.listConversations);
router.get("/search", conversationController.searchConversations);
router.post("/", conversationController.createConversation);
router.patch("/:id/state", conversationController.updateParticipantState);

router.get("/:id/messages", messageController.listMessages);
router.post("/:id/read", messageController.markRead);
router.post("/:id/attachments", messageAttachmentUpload.array("files", 5), messageController.uploadAttachment);

export default router;
