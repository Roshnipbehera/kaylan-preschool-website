// Socket.io server attached directly to the Express HTTP server (see
// src/server.ts). Handles real-time message delivery, typing indicators,
// presence, and read receipts for the Messaging domain.
import type { Server as HttpServer } from "http";
import { Server as IOServer, Socket } from "socket.io";
import cookie from "cookie";
import { verifyAccessToken, ACCESS_COOKIE_NAME } from "../utils/token";
import { prisma } from "../lib/prisma";
import { logger } from "../config/logger";

let io: IOServer | undefined;

// In-memory presence map: userId -> set of active socket ids. A user can
// have multiple tabs/devices open, so we track a set, not a single id.
// FUTURE SCALING PATH: replace with a Redis-backed adapter (socket.io-redis
// + a Redis hash of userId -> socketIds) once running more than one Node
// process, so presence is shared across instances instead of per-process.
const onlineUsers = new Map<string, Set<string>>();

export function conversationRoom(conversationId: string): string {
  return `conversation:${conversationId}`;
}

export function notificationRoom(userId: string): string {
  return `user:${userId}`;
}

function extractToken(socket: Socket): string | null {
  const authToken = socket.handshake.auth?.token as string | undefined;
  if (authToken) return authToken;

  const rawCookie = socket.handshake.headers.cookie;
  if (!rawCookie) return null;
  const parsed = cookie.parse(rawCookie);
  return parsed[ACCESS_COOKIE_NAME] ?? null;
}

export function initSocket(server: HttpServer): IOServer {
  io = new IOServer(server, {
    cors: { origin: process.env.CLIENT_URL ?? "http://localhost:3000", credentials: true },
  });

  // Handshake-time auth: reject the connection outright if the access
  // token is missing/invalid/expired, before any room can be joined.
  io.use((socket, next) => {
    const token = extractToken(socket);
    if (!token) return next(new Error("Unauthorized: no access token"));
    try {
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.sub;
      socket.data.role = payload.role;
      next();
    } catch {
      next(new Error("Unauthorized: invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    logger.debug({ userId, socketId: socket.id }, "socket connected");
    socket.join(notificationRoom(userId));

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId)!.add(socket.id);
    if (onlineUsers.get(userId)!.size === 1) {
      socket.broadcast.emit("user_online", { userId });
    }

    socket.on("join_conversation", async (conversationId: string) => {
      const participant = await prisma.conversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId, userId } },
      });
      if (!participant) return; // silently ignore -- not authorized for this room
      socket.join(conversationRoom(conversationId));
    });

    socket.on("leave_conversation", (conversationId: string) => {
      socket.leave(conversationRoom(conversationId));
    });

    socket.on("typing_start", (conversationId: string) => {
      socket.to(conversationRoom(conversationId)).emit("typing_start", { conversationId, userId });
    });

    socket.on("typing_stop", (conversationId: string) => {
      socket.to(conversationRoom(conversationId)).emit("typing_stop", { conversationId, userId });
    });

    socket.on("message_delivered", ({ conversationId, messageId }: { conversationId: string; messageId: string }) => {
      socket.to(conversationRoom(conversationId)).emit("message_delivered", { conversationId, messageId, userId });
    });

    socket.on("disconnect", () => {
      logger.debug({ userId, socketId: socket.id }, "socket disconnected");
      const sockets = onlineUsers.get(userId);
      sockets?.delete(socket.id);
      if (sockets && sockets.size === 0) {
        onlineUsers.delete(userId);
        socket.broadcast.emit("user_offline", { userId });
      }
    });
  });

  return io;
}

export function getIO(): IOServer | undefined {
  return io;
}

export function isUserOnline(userId: string): boolean {
  return onlineUsers.has(userId);
}
