// Live Messaging API client -- talks to the real Express backend
// (backend/src/controllers/conversationController.ts and
// messageController.ts) via lib/api/client.ts's apiFetch, following the same
// convention as lib/api/auth.ts / lib/api/users.ts. Every exported function
// here maps 1:1 to an endpoint that actually exists in
// backend/src/routes/{conversationRoutes,messageRoutes}.ts -- no invented
// endpoints (no forward/mute-toggle-via-body variants, no server-side
// "search across all" beyond what searchConversations/searchMessages do).
//
// NOTE: this file replaces the previous JSON-mock client that called
// app/api/messaging/**. Those route handlers and data/messaging/*.json are
// left in place untouched but are no longer imported by any live UI code.
import { apiFetch, API_BASE_URL, ApiError } from "@/lib/api/client";
import type { LiveConversation, LiveMessage, ListMessagesResult } from "@/lib/types/messaging-live";

export async function listConversations(): Promise<LiveConversation[]> {
  return apiFetch<LiveConversation[]>("/conversations");
}

export async function searchConversations(q: string): Promise<LiveConversation[]> {
  return apiFetch<LiveConversation[]>(`/conversations/search?q=${encodeURIComponent(q)}`);
}

export async function createConversation(participantId: string, subject?: string): Promise<LiveConversation> {
  return apiFetch<LiveConversation>("/conversations", {
    method: "POST",
    json: { participantIds: [participantId], subject },
  });
}

export async function updateConversationState(
  id: string,
  state: { isArchived?: boolean; isPinned?: boolean; isMuted?: boolean }
): Promise<unknown> {
  return apiFetch(`/conversations/${id}/state`, { method: "PATCH", json: state });
}

export async function listMessages(conversationId: string, opts: { cursor?: string; limit?: number } = {}): Promise<ListMessagesResult> {
  const qs = new URLSearchParams();
  if (opts.cursor) qs.set("cursor", opts.cursor);
  if (opts.limit) qs.set("limit", String(opts.limit));
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<ListMessagesResult>(`/conversations/${conversationId}/messages${suffix}`);
}

export async function sendMessage(input: { conversationId: string; body: string; replyToMessageId?: string }): Promise<LiveMessage> {
  return apiFetch<LiveMessage>("/messages", { method: "POST", json: input });
}

export async function uploadAttachment(conversationId: string, body: string, files: File[]): Promise<LiveMessage> {
  const form = new FormData();
  form.append("conversationId", conversationId);
  form.append("body", body);
  files.forEach((f) => form.append("files", f));

  // apiFetch always JSON-encodes; attachments need multipart, so this one
  // bypasses apiFetch and hand-rolls the same conventions (credentials
  // include, ApiResponse envelope) it uses.
  const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/attachments`, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload || payload.success === false) {
    throw new ApiError(payload?.message ?? res.statusText ?? "Upload failed", res.status);
  }
  return payload.data as LiveMessage;
}

export async function markRead(conversationId: string, messageId: string): Promise<void> {
  await apiFetch(`/conversations/${conversationId}/read`, { method: "POST", json: { messageId } });
}

export async function editMessage(id: string, body: string): Promise<LiveMessage> {
  return apiFetch<LiveMessage>(`/messages/${id}`, { method: "PATCH", json: { body } });
}

export async function deleteMessage(id: string, scope: "me" | "everyone" = "me"): Promise<unknown> {
  return apiFetch(`/messages/${id}?scope=${scope}`, { method: "DELETE" });
}

export async function pinMessage(id: string, isPinned: boolean): Promise<LiveMessage> {
  return apiFetch<LiveMessage>(`/messages/${id}/pin`, { method: "PATCH", json: { isPinned } });
}

export async function reactToMessage(id: string, emoji: string): Promise<unknown> {
  return apiFetch(`/messages/${id}/reactions`, { method: "POST", json: { emoji } });
}

export async function removeReaction(id: string, emoji: string): Promise<void> {
  await apiFetch(`/messages/${id}/reactions/${encodeURIComponent(emoji)}`, { method: "DELETE" });
}

export async function searchMessages(q: string, conversationId?: string): Promise<LiveMessage[]> {
  const qs = new URLSearchParams({ q });
  if (conversationId) qs.set("conversationId", conversationId);
  return apiFetch<LiveMessage[]>(`/messages/search?${qs.toString()}`);
}
