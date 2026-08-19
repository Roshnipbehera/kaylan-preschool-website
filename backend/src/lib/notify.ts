// Shared helper for creating Notification rows (Batch 4 migration pass).
// The Notification model + MESSAGE-type notifications were already live
// from the Messaging batch (backend/src/socket/index.ts /
// messageController.ts's broadcastNewMessage). This helper extends
// notification creation to the other NotificationType values (ANNOUNCEMENT,
// HOMEWORK, ATTENDANCE, FEE, EVENT) so non-message controllers can create
// real persisted notifications instead of the frontend's old purely-derived
// useNotifications.ts composition.
import { prisma } from "./prisma";
import type { NotificationType } from "@prisma/client";

export async function notifyUser(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        relatedEntityType: params.relatedEntityType,
        relatedEntityId: params.relatedEntityId,
      },
    });
  } catch {
    // swallow -- never break the primary mutation
  }
}

export async function notifyUsers(
  userIds: string[],
  params: Omit<Parameters<typeof notifyUser>[0], "userId">,
): Promise<void> {
  await Promise.all(userIds.map((userId) => notifyUser({ ...params, userId })));
}
