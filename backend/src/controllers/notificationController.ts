import { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import { prisma } from "../lib/prisma";

// Live Notification reads (Batch 4 migration pass). The Notification model
// + MESSAGE-type rows were already live from the Messaging batch (pushed
// over Socket.io). This adds REST endpoints so
// lib/hooks/useNotifications.ts can read the full persisted list (all
// NotificationType values, not just MESSAGE) instead of deriving
// announcement/fee/attendance notifications client-side from scattered
// JSON-backed API clients.

export async function listNotifications(req: Request, res: Response) {
  if (!req.user) throw new AppError("Not authenticated", 401);
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.sub },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json({
    success: true,
    data: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      relatedEntityType: n.relatedEntityType ?? undefined,
      relatedEntityId: n.relatedEntityId ?? undefined,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    })),
  });
}

export async function markRead(req: Request, res: Response) {
  if (!req.user) throw new AppError("Not authenticated", 401);
  const notification = await prisma.notification.updateMany({
    where: { id: req.params.id, userId: req.user.sub },
    data: { isRead: true },
  });
  if (notification.count === 0) throw new AppError("Notification not found", 404);
  res.json({ success: true, data: { ok: true } });
}

export async function markAllRead(req: Request, res: Response) {
  if (!req.user) throw new AppError("Not authenticated", 401);
  await prisma.notification.updateMany({ where: { userId: req.user.sub, isRead: false }, data: { isRead: true } });
  res.json({ success: true, data: { ok: true } });
}
