"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, MessageCircle, Megaphone, IndianRupee, CalendarX } from "lucide-react";
import { useNotifications, type NotificationKind } from "@/lib/hooks/useNotifications";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<NotificationKind, typeof Bell> = {
  message: MessageCircle,
  announcement: Megaphone,
  fee: IndianRupee,
  attendance: CalendarX,
};

// Parent-scoped notification bell rendered inside the shared DashboardShell
// header. Purely aggregates already-built domains client-side (see
// lib/hooks/useNotifications.ts) -- no new backend endpoints.
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, readIds, markAllRead, markRead } = useNotifications();

  return (
    <div className="relative">
      <button
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-1.5 text-sm font-heading text-[#3a2e4d] hover:text-candy"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-candy px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            aria-label="Close notifications"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-80 max-w-[90vw] rounded-2xl border border-black/5 bg-white p-3 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-[#3a2e4d]">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs font-semibold text-candy hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-1 py-4 text-center text-xs text-[#3a2e4d]/50">You&rsquo;re all caught up!</p>
              ) : (
                notifications.map((n) => {
                  const Icon = KIND_ICON[n.kind];
                  const unread = !readIds.has(n.id);
                  return (
                    <Link
                      key={n.id}
                      href={n.href}
                      onClick={() => {
                        markRead(n.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex gap-2 rounded-xl px-2 py-2 text-left transition-colors hover:bg-candy/10",
                        unread && "bg-[#faf9ff]",
                      )}
                    >
                      <Icon size={16} className="mt-0.5 shrink-0 text-candy" />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate text-xs font-heading font-semibold text-[#3a2e4d]">{n.title}</span>
                          {unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-candy" />}
                        </span>
                        <span className="line-clamp-2 text-xs text-[#3a2e4d]/60">{n.description}</span>
                        <span className="text-[10px] text-[#3a2e4d]/40">{new Date(n.date).toLocaleDateString()}</span>
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
