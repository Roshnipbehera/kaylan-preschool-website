// Socket.io client connecting to the real Express + Socket.io backend
// (backend/src/socket/index.ts) once messaging is switched to live mode.
//
// SCOPE NOTE: this file is foundation only for this migration pass -- the
// backend Socket.io server (connection auth, rooms, the full event map:
// join_conversation, typing_start/stop, receive_message, message_updated,
// message_deleted, message_read, user_online/offline, notification) is
// fully implemented and live. Wiring the existing Teacher Messages UI
// (app/(dashboard)/**/messages, lib/messaging/store.ts) to consume this
// client via a Zustand store, plus the richer chat UI (reactions, replies,
// attachments, infinite scroll) described in the migration brief, is NOT
// done in this pass -- that UI still talks to the JSON-backed
// app/api/messaging/** mock routes documented in lib/api/messaging.ts.
// Swapping the UI over is future work; this client is what it will use.
import { io, type Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";

let socket: Socket | undefined;

/**
 * Lazily creates (or returns) the singleton Socket.io connection. The
 * access token is passed via `auth` (preferred -- works even though the
 * real access-token cookie is httpOnly and thus unreadable by client JS)
 * rather than relying solely on the cookie reaching the handshake, though
 * the backend also accepts the cookie as a fallback (see
 * backend/src/socket/index.ts extractToken()).
 */
export function getSocket(accessToken?: string): Socket {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
    auth: accessToken ? { token: accessToken } : undefined,
  });

  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = undefined;
}

export function conversationRoom(conversationId: string): string {
  return `conversation:${conversationId}`;
}
