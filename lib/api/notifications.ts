// Live Notifications client (Batch 4 migration pass) -- talks to the real
// Express backend (backend/src/controllers/notificationController.ts) via
// lib/api/client.ts's apiFetch. The Notification model + MESSAGE-type rows
// were already live (pushed over Socket.io by the Messaging batch); this
// adds REST reads for the full persisted list across all NotificationType
// values (ANNOUNCEMENT, HOMEWORK, ATTENDANCE, FEE, EVENT, MESSAGE), now
// that the relevant controllers (fees, announcements, attendance, homework,
// events) create Notification rows server-side via backend/src/lib/notify.ts.
import { apiFetch } from "@/lib/api/client";

export type BackendNotificationType = "MESSAGE" | "ANNOUNCEMENT" | "HOMEWORK" | "ATTENDANCE" | "FEE" | "EVENT";

export interface BackendNotification {
  id: string;
  type: BackendNotificationType;
  title: string;
  body: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  isRead: boolean;
  createdAt: string;
}

export async function listNotifications(): Promise<BackendNotification[]> {
  return apiFetch<BackendNotification[]>("/notifications", { cache: "no-store" });
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiFetch<{ ok: true }>(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch<{ ok: true }>("/notifications/read-all", { method: "POST" });
}
