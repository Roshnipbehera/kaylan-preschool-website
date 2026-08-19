import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { createConversationSchema } from "../validation/messaging";
import type { UserRole } from "@prisma/client";
import { getIO, notificationRoom } from "../socket";

// Only these role pairings may message each other. Parent<->Parent and
// Teacher<->Teacher are explicitly rejected.
const ALLOWED_PAIRS = new Set<string>(["PARENT:TEACHER", "TEACHER:PARENT", "PARENT:ADMIN", "ADMIN:PARENT", "ADMIN:TEACHER", "TEACHER:ADMIN"]);

function assertAllowedPair(roleA: UserRole, roleB: UserRole) {
  if (!ALLOWED_PAIRS.has(`${roleA}:${roleB}`)) {
    throw new AppError(`Conversations between two ${roleA.toLowerCase()}s are not permitted`, 400);
  }
}

export async function listConversations(req: Request, res: Response) {
  const userId = req.user!.sub;
  const participantRows = await prisma.conversationParticipant.findMany({
    where: { userId },
    include: {
      conversation: {
        include: {
          participants: { include: { user: { select: { id: true, name: true, role: true, avatarUrl: true } } } },
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      },
    },
    orderBy: { conversation: { updatedAt: "desc" } },
  });

  // Batch-fetch createdAt for every lastReadMessageId in one round trip
  // instead of doing a findUnique per conversation inside the loop below.
  const lastReadIds = participantRows.map((r) => r.lastReadMessageId).filter((id): id is string => !!id);
  const lastReadMessages = lastReadIds.length
    ? await prisma.message.findMany({ where: { id: { in: lastReadIds } }, select: { id: true, createdAt: true } })
    : [];
  const lastReadCreatedAtById = new Map(lastReadMessages.map((m) => [m.id, m.createdAt]));

  const data = await Promise.all(
    participantRows.map(async (row) => {
      const unreadCount = await prisma.message.count({
        where: {
          conversationId: row.conversationId,
          senderId: { not: userId },
          createdAt: row.lastReadMessageId ? { gt: lastReadCreatedAtById.get(row.lastReadMessageId) ?? new Date(0) } : undefined,
        },
      });
      return {
        id: row.conversation.id,
        subject: row.conversation.subject,
        participants: row.conversation.participants.map((p) => ({ id: p.user.id, name: p.user.name, role: p.user.role.toLowerCase(), avatarUrl: p.user.avatarUrl })),
        lastMessage: row.conversation.messages[0] ?? null,
        isArchived: row.isArchived,
        isPinned: row.isPinned,
        isMuted: row.isMuted,
        unreadCount,
        updatedAt: row.conversation.updatedAt,
      };
    })
  );

  res.json({ success: true, data });
}

export async function createConversation(req: Request, res: Response) {
  const { participantIds, subject } = createConversationSchema.parse(req.body);
  const requester = req.user!;

  const otherUser = await prisma.user.findUnique({ where: { id: participantIds[0] } });
  if (!otherUser) throw new AppError("Participant not found", 404);
  // req.user.role is the JWT's lowercase JwtRole; otherUser.role is the
  // Prisma UserRole enum (uppercase) -- normalize before comparing.
  assertAllowedPair(requester.role.toUpperCase() as UserRole, otherUser.role);

  // Reuse an existing 1:1 conversation between these two users if present.
  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: requester.sub } } },
        { participants: { some: { userId: otherUser.id } } },
      ],
    },
  });
  if (existing) {
    return res.json({ success: true, data: existing });
  }

  const conversation = await prisma.conversation.create({
    data: {
      subject,
      participants: {
        create: [
          { userId: requester.sub, roleAtJoin: requester.role.toUpperCase() as UserRole },
          { userId: otherUser.id, roleAtJoin: otherUser.role },
        ],
      },
    },
    include: { participants: true },
  });

  res.status(201).json({ success: true, data: conversation });
}

export async function updateParticipantState(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.user!.sub;
  const { isArchived, isPinned, isMuted } = req.body as { isArchived?: boolean; isPinned?: boolean; isMuted?: boolean };

  const participant = await prisma.conversationParticipant.findUnique({ where: { conversationId_userId: { conversationId: id, userId } } });
  if (!participant) throw new AppError("Not a participant in this conversation", 404);

  const updated = await prisma.conversationParticipant.update({
    where: { id: participant.id },
    data: {
      ...(isArchived !== undefined ? { isArchived } : {}),
      ...(isPinned !== undefined ? { isPinned } : {}),
      ...(isMuted !== undefined ? { isMuted } : {}),
    },
  });

  res.json({ success: true, data: updated });
}

export async function searchConversations(req: Request, res: Response) {
  const userId = req.user!.sub;
  const q = String(req.query.q ?? "").trim();
  if (!q) return res.json({ success: true, data: [] });

  const rows = await prisma.conversationParticipant.findMany({
    where: {
      userId,
      conversation: {
        OR: [
          { subject: { contains: q, mode: "insensitive" } },
          { participants: { some: { user: { name: { contains: q, mode: "insensitive" } } } } },
          { messages: { some: { body: { contains: q, mode: "insensitive" } } } },
        ],
      },
    },
    include: { conversation: true },
  });

  res.json({ success: true, data: rows.map((r) => r.conversation) });
}

export { notificationRoom, getIO };
