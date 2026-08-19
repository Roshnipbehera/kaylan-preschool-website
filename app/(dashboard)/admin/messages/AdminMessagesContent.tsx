"use client";

// Admin messaging, added as part of the live-backend messaging migration.
// Reuses the same shared chat UI as parent/teacher messages -- see
// components/messaging/MessagingPanel.tsx -- rather than a bespoke build,
// per project convention. Admins can message teachers or parents (server
// enforces ALLOWED_PAIRS in backend/src/controllers/conversationController.ts;
// this UI does not attempt to start Admin<->Admin conversations).
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { MessagingPanel } from "@/components/messaging/MessagingPanel";

export function AdminMessagesContent() {
  return (
    <div>
      <AdminSubNav />
      <MessagingPanel />
    </div>
  );
}
