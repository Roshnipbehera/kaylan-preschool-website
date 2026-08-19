"use client";

// Now backed by the live messaging store (real backend REST + Socket.io) --
// see components/messaging/MessagingPanel.tsx and lib/messaging/store.ts.
// Previously called lib/api/messaging.ts's JSON-mock client directly; that
// client has been rewired to the real backend and the bespoke chat markup
// here was consolidated into the shared panel component.
import { ParentSubNav } from "@/components/parent/ParentSubNav";
import { MessagingPanel } from "@/components/messaging/MessagingPanel";

export function ParentMessagesContent() {
  return (
    <div>
      <ParentSubNav />
      <MessagingPanel />
    </div>
  );
}
