"use client";

// Aggregates parent-relevant notifications purely on the client by combining
// data already fetched via the existing typed API clients for messaging,
// announcements, fees and attendance. Does NOT introduce a new backend --
// read-only composition over already-built domains, refreshed periodically
// via React Query polling. Read/unread state for the bell itself is kept in
// localStorage (per user) since these are cross-domain, ephemeral UI reads.

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/hooks/useAuth";
import { listStudents } from "@/lib/api/students";
import { listAnnouncements } from "@/lib/api/announcements";
import { listInvoices } from "@/lib/api/fees";
import { listAttendance } from "@/lib/api/attendance";
import { listNotifications as listBackendNotifications } from "@/lib/api/notifications";
import { getSocket } from "@/lib/socket/client";

// A live "MESSAGE" notification pushed over Socket.io by
// backend/src/controllers/messageController.ts's broadcastNewMessage() (see
// notification event in backend/src/socket/index.ts).
interface LiveNotificationEvent {
  id: string;
  type: string;
  title: string;
  body: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt: string;
}

export type NotificationKind = "message" | "announcement" | "fee" | "attendance";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  date: string; // ISO
  href: string;
}

function storageKey(userId: string) {
  return `kaylan_notifications_read_${userId}`;
}

export function useNotifications() {
  const { user, role } = useAuth();
  const isTeacher = role === "teacher";
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;
    try {
      const raw = window.localStorage.getItem(storageKey(user.id));
      setReadIds(new Set(raw ? (JSON.parse(raw) as string[]) : []));
    } catch {
      setReadIds(new Set());
    }
  }, [user?.id]);

  const { data: students } = useQuery({
    queryKey: ["students", user?.id ?? "all", isTeacher ? "teacher" : "parent"],
    queryFn: () => (isTeacher ? listStudents({ teacherUserId: user?.id }) : listStudents({ parentUserId: user?.id })),
    enabled: !!user?.id,
  });
  const student = students?.[0];

  // Live message notifications: unlike the other domains below (still
  // polled via React Query against JSON-backed routes), messaging is now on
  // the real backend, so new-message notifications arrive over Socket.io's
  // `notification` event (backend/src/socket/index.ts / messageController.ts
  // broadcastNewMessage) instead of being polled. Existing polling logic for
  // announcements/fees/attendance below is untouched.
  const { data: liveMessageNotifications = [] } = useQuery<LiveNotificationEvent[]>({
    queryKey: ["live-message-notifications", user?.id ?? "anon"],
    queryFn: () => [],
    enabled: !!user?.id,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!user?.id) return;
    const token = typeof window !== "undefined" ? window.localStorage.getItem("kaylan_token") ?? undefined : undefined;
    const socket = getSocket(token);
    if (!socket.connected) socket.connect();

    const handler = (notification: LiveNotificationEvent) => {
      if (notification.type !== "MESSAGE") return;
      queryClient.setQueryData<LiveNotificationEvent[]>(["live-message-notifications", user.id], (prev) => {
        const existing = prev ?? [];
        if (existing.some((n) => n.id === notification.id)) return existing;
        return [notification, ...existing].slice(0, 50);
      });
    };

    socket.on("notification", handler);
    return () => {
      socket.off("notification", handler);
    };
  }, [user?.id, queryClient]);

  // Real persisted notifications (Batch 4): non-message NotificationType
  // rows now created server-side by feesController/announcementController/
  // attendanceController/homeworkController/eventController via
  // backend/src/lib/notify.ts. Polled alongside the still-derived queries
  // below and merged/deduped by (kind, related entity) so re-running this
  // hook doesn't double-count an item that's also derived client-side.
  const { data: backendNotifications = [] } = useQuery({
    queryKey: ["backend-notifications", user?.id ?? "anon"],
    queryFn: listBackendNotifications,
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  const { data: announcements } = useQuery({
    queryKey: ["announcements"],
    queryFn: listAnnouncements,
    refetchInterval: 30000,
  });

  const { data: invoices } = useQuery({
    queryKey: ["invoices", user?.id ?? "all"],
    queryFn: () => listInvoices(),
    enabled: !!user?.id && !isTeacher,
  });

  const monthKey = new Date().toISOString().slice(0, 7);
  const { data: attendance } = useQuery({
    queryKey: ["attendance-records", student?.id ?? "", monthKey],
    queryFn: () => listAttendance({ studentId: student!.id, month: monthKey }),
    enabled: !!student?.id && !isTeacher,
  });

  const notifications = useMemo<AppNotification[]>(() => {
    const list: AppNotification[] = [];

    liveMessageNotifications.forEach((n) =>
      list.push({
        id: `message-${n.id}`,
        kind: "message",
        title: n.title,
        description: n.body,
        date: n.createdAt,
        href: isTeacher ? "/teacher/messages" : "/parent/messages",
      }),
    );

    (announcements ?? [])
      .filter((a) => a.audience === "all" || (isTeacher ? a.audience === "teachers" : a.audience === "parents"))
      .slice(0, 5)
      .forEach((a) =>
        list.push({
          id: `announcement-${a.id}`,
          kind: "announcement",
          title: a.title,
          description: a.body,
          date: a.date,
          href: isTeacher ? "/teacher/announcements" : "/parent/announcements",
        }),
      );

    (invoices ?? [])
      .filter((i) => i.status !== "paid")
      .forEach((i) =>
        list.push({
          id: `fee-${i.id}`,
          kind: "fee",
          title: `Fee due: ${i.title}`,
          description: `Rs. ${i.amount.toLocaleString("en-IN")} due by ${new Date(i.dueDate).toLocaleDateString()}`,
          date: i.dueDate,
          href: "/parent/fees",
        }),
      );

    (attendance ?? [])
      .filter((r) => r.status === "absent")
      .forEach((r) =>
        list.push({
          id: `attendance-${r.id}`,
          kind: "attendance",
          title: "Marked absent",
          description: `Your child was marked absent on ${new Date(r.date).toLocaleDateString()}.`,
          date: r.date,
          href: "/parent/attendance",
        }),
      );

    const seenEntityIds = new Set(
      list.map((n) => n.id.split("-").slice(1).join("-")).filter(Boolean),
    );
    const kindByType: Record<string, NotificationKind> = {
      ANNOUNCEMENT: "announcement",
      FEE: "fee",
      ATTENDANCE: "attendance",
      HOMEWORK: "announcement",
      EVENT: "announcement",
      MESSAGE: "message",
    };
    backendNotifications
      .filter((n) => n.type !== "MESSAGE") // live message notifications already handled via socket above
      .forEach((n) => {
        if (n.relatedEntityId && seenEntityIds.has(n.relatedEntityId)) return;
        list.push({
          id: `backend-${n.id}`,
          kind: kindByType[n.type] ?? "announcement",
          title: n.title,
          description: n.body,
          date: n.createdAt,
          href: isTeacher ? "/teacher/announcements" : "/parent/announcements",
        });
      });

    return list.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [liveMessageNotifications, announcements, invoices, attendance, backendNotifications, user?.id, isTeacher]);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const markAllRead = () => {
    if (!user?.id) return;
    const next = new Set(readIds);
    notifications.forEach((n) => next.add(n.id));
    setReadIds(next);
    window.localStorage.setItem(storageKey(user.id), JSON.stringify(Array.from(next)));
  };

  const markRead = (id: string) => {
    if (!user?.id) return;
    const next = new Set(readIds);
    next.add(id);
    setReadIds(next);
    window.localStorage.setItem(storageKey(user.id), JSON.stringify(Array.from(next)));
  };

  return { notifications, unreadCount, readIds, markAllRead, markRead };
}
