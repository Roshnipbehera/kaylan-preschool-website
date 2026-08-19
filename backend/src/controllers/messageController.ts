import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { sendMessageSchema, editMessageSchema, reactionSchema, paginationSchema } from "../validation/messaging";
import { uploadImageBuffer } from "../config/cloudinary";
import { scanFile } from "../security/scanFile";
import { getIO, conversationRoom, notificationRoom } from "../socket";

async function assertParticipant(conversationId: string, userId: string) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!participant) throw new AppError("Not a participant in this conversation", 403);
  return participant;
}

// Cursor-paginated message history, newest-first page, oldest-first render
// order left to the client (matches typical chat UI infinite-scroll-up).
export async function listMessages(req: Request, res: Response) {
  const { id: conversationId } = req.params;
  const userId = req.user!.sub;
  await assertParticipant(conversationId, userId);

  const { cursor, limit } = paginationSchema.parse(req.query);

  const messages = await prisma.message.findMany({
    where: { conversationId, deletions: { none: { userId } } },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      sender: { select: { id: true, name: true, role: true, avatarUrl: true } },
      attachments: true,
      reactions: true,
      readReceipts: true,
    },
  });

  const hasMore = messages.length > limit;
  const page = hasMore ? messages.slice(0, limit) : messages;

  res.json({ success: true, data: { messages: page, nextCursor: hasMore ? page[page.length - 1].id : null } });
}

export async function sendMessage(req: Request, res: Response) {
  const { conversationId, body, replyToMessageId } = sendMessageSchema.parse(req.body);
  const userId = req.user!.sub;
  await assertParticipant(conversationId, userId);

  const message = await prisma.message.create({
    data: { conversationId, senderId: userId, body, replyToMessageId },
    include: { sender: { select: { id: true, name: true, role: true, avatarUrl: true } }, attachments: true },
  });

  await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });

  broadcastNewMessage(conversationId, message);
  res.status(201).json({ success: true, data: message });
}

export async function uploadAttachment(req: Request, res: Response) {
  const { conversationId, body, replyToMessageId } = sendMessageSchema
    .extend({ body: sendMessageSchema.shape.body.default("") })
    .parse(req.body);
  const userId = req.user!.sub;
  await assertParticipant(conversationId, userId);

  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  if (files.length === 0) throw new AppError("No files uploaded", 400);

  const message = await prisma.message.create({
    data: { conversationId, senderId: userId, body: body || "", replyToMessageId },
  });

  const attachments = [];
  for (const file of files) {
    const scan = await scanFile(file.buffer);
    if (!scan.clean) throw new AppError(`Attachment rejected: ${scan.reason ?? "failed virus scan"}`, 422);

    const url = await uploadImageBuffer(file.buffer, "kaylan-preschool/messaging");
    const attachment = await prisma.attachment.create({
      data: {
        messageId: message.id,
        url,
        type: file.mimetype.startsWith("image/") ? "image" : "file",
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      },
    });
    attachments.push(attachment);
  }

  const full = await prisma.message.findUnique({
    where: { id: message.id },
    include: { sender: { select: { id: true, name: true, role: true, avatarUrl: true } }, attachments: true },
  });

  await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
  broadcastNewMessage(conversationId, full);
  res.status(201).json({ success: true, data: full });
}

export async function editMessage(req: Request, res: Response) {
  const { id } = req.params;
  const { body } = editMessageSchema.parse(req.body);
  const userId = req.user!.sub;

  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw new AppError("Message not found", 404);
  if (message.senderId !== userId) throw new AppError("Cannot edit another user's message", 403);
  if (message.isDeletedForEveryone) throw new AppError("Cannot edit a deleted message", 400);

  const updated = await prisma.message.update({ where: { id }, data: { body, isEdited: true, editedAt: new Date() } });

  getIO()?.to(conversationRoom(message.conversationId)).emit("message_updated", updated);
  res.json({ success: true, data: updated });
}

// Delete "for me" (default) or "for everyone" (?scope=everyone, sender only).
export async function deleteMessage(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.user!.sub;
  const scope = req.query.scope === "everyone" ? "everyone" : "me";

  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw new AppError("Message not found", 404);

  if (scope === "everyone") {
    if (message.senderId !== userId) throw new AppError("Only the sender can delete for everyone", 403);
    const updated = await prisma.message.update({ where: { id }, data: { isDeletedForEveryone: true, body: "" } });
    getIO()?.to(conversationRoom(message.conversationId)).emit("message_deleted", { id, scope: "everyone" });
    return res.json({ success: true, data: updated });
  }

  await prisma.messageDeletion.upsert({
    where: { messageId_userId: { messageId: id, userId } },
    create: { messageId: id, userId },
    update: {},
  });
  res.json({ success: true, data: { id, scope: "me" } });
}

export async function pinMessage(req: Request, res: Response) {
  const { id } = req.params;
  const { isPinned } = req.body as { isPinned: boolean };
  const updated = await prisma.message.update({ where: { id }, data: { isPinned: Boolean(isPinned) } });
  getIO()?.to(conversationRoom(updated.conversationId)).emit("message_updated", updated);
  res.json({ success: true, data: updated });
}

export async function reactToMessage(req: Request, res: Response) {
  const { id } = req.params;
  const { emoji } = reactionSchema.parse(req.body);
  const userId = req.user!.sub;

  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw new AppError("Message not found", 404);

  const reaction = await prisma.messageReaction.upsert({
    where: { messageId_userId_emoji: { messageId: id, userId, emoji } },
    create: { messageId: id, userId, emoji },
    update: {},
  });

  getIO()?.to(conversationRoom(message.conversationId)).emit("message_updated", { id, reactionAdded: reaction });
  res.status(201).json({ success: true, data: reaction });
}

export async function removeReaction(req: Request, res: Response) {
  const { id, emoji } = req.params;
  const userId = req.user!.sub;
  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw new AppError("Message not found", 404);

  await prisma.messageReaction.deleteMany({ where: { messageId: id, userId, emoji } });
  getIO()?.to(conversationRoom(message.conversationId)).emit("message_updated", { id, reactionRemoved: { userId, emoji } });
  res.json({ success: true, data: null });
}

export async function markRead(req: Request, res: Response) {
  const { id: conversationId } = req.params;
  const { messageId } = req.body as { messageId: string };
  const userId = req.user!.sub;

  await prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastReadMessageId: messageId },
  });
  await prisma.readReceipt.upsert({
    where: { messageId_userId: { messageId, userId } },
    create: { messageId, userId },
    update: { readAt: new Date() },
  });

  getIO()?.to(conversationRoom(conversationId)).emit("message_read", { conversationId, messageId, userId });
  res.json({ success: true, data: null });
}

export async function searchMessages(req: Request, res: Response) {
  const userId = req.user!.sub;
  const q = String(req.query.q ?? "").trim();
  const conversationId = req.query.conversationId ? String(req.query.conversationId) : undefined;
  if (!q) return res.json({ success: true, data: [] });

  const messages = await prisma.message.findMany({
    where: {
      body: { contains: q, mode: "insensitive" },
      isDeletedForEveryone: false,
      ...(conversationId ? { conversationId } : {}),
      conversation: { participants: { some: { userId } } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  res.json({ success: true, data: messages });
}

// --- internal helper -------------------------------------------------------

async function broadcastNewMessage(conversationId: string, message: unknown) {
  const io = getIO();
  if (!io) return;
  io.to(conversationRoom(conversationId)).emit("receive_message", message);

  // Notify participants who are not currently in the conversation room
  // (e.g. viewing a different screen) via their personal notification room.
  const participants = await prisma.conversationParticipant.findMany({ where: { conversationId } });
  const msg = message as { senderId: string; id: string; body: string };
  for (const p of participants) {
    if (p.userId === msg.senderId) continue;
    const notification = await prisma.notification.create({
      data: {
        userId: p.userId,
        type: "MESSAGE",
        title: "New message",
        body: msg.body.slice(0, 120),
        relatedEntityType: "conversation",
        relatedEntityId: conversationId,
      },
    });
    io.to(notificationRoom(p.userId)).emit("notification", notification);
  }
}
