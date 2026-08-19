// Zustand store for the LIVE messaging domain, wired to the real backend
// REST client (lib/api/messaging.ts) and Socket.io client
// (lib/socket/client.ts -> backend/src/socket/index.ts). Consumed by
// components/messaging/MessagingPanel.tsx (shared by the parent/teacher/
// admin messages pages).
//
// NOTE: this file previously held a small persistence helper used only by
// the OLD JSON-mock app/api/messaging/**/route.ts handlers. That helper was
// dead code (the routes import app/api/messaging/_store.ts directly, not
// this file) and has been fully replaced here -- nothing else in the repo
// imported "@/lib/messaging/store" before this change.
import { create } from "zustand";
import { getSocket, conversationRoom } from "@/lib/socket/client";
import * as api from "@/lib/api/messaging";
import type { LiveConversation, LiveMessage } from "@/lib/types/messaging-live";

interface MessagingState {
  conversations: LiveConversation[];
  activeConversationId: string | null;
  messagesByConversation: Record<string, LiveMessage[]>;
  nextCursorByConversation: Record<string, string | null>;
  onlineUserIds: Set<string>;
  typingByConversation: Record<string, Set<string>>;
  connected: boolean;

  connect: (accessToken?: string) => void;
  disconnect: () => void;
  setActiveConversation: (id: string | null) => void;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string, opts?: { more?: boolean }) => Promise<void>;
  send: (conversationId: string, body: string, replyToMessageId?: string) => Promise<void>;
  markConversationRead: (conversationId: string) => Promise<void>;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
}

let socketBound = false;

export const useMessagingStore = create<MessagingState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messagesByConversation: {},
  nextCursorByConversation: {},
  onlineUserIds: new Set(),
  typingByConversation: {},
  connected: false,

  connect: (accessToken) => {
    const socket = getSocket(accessToken);
    if (!socketBound) {
      socketBound = true;

      socket.on("connect", () => set({ connected: true }));
      socket.on("disconnect", () => set({ connected: false }));

      socket.on("receive_message", (message: LiveMessage) => {
        set((state) => {
          const existing = state.messagesByConversation[message.conversationId] ?? [];
          if (existing.some((m) => m.id === message.id)) return state;
          return {
            messagesByConversation: {
              ...state.messagesByConversation,
              [message.conversationId]: [...existing, message],
            },
          };
        });
      });

      socket.on("message_updated", (updated: Partial<LiveMessage> & { id: string }) => {
        set((state) => {
          const next = { ...state.messagesByConversation };
          for (const convId of Object.keys(next)) {
            next[convId] = next[convId].map((m) => (m.id === updated.id ? { ...m, ...updated } : m));
          }
          return { messagesByConversation: next };
        });
      });

      socket.on("message_deleted", ({ id, scope }: { id: string; scope: "me" | "everyone" }) => {
        if (scope !== "everyone") return;
        set((state) => {
          const next = { ...state.messagesByConversation };
          for (const convId of Object.keys(next)) {
            next[convId] = next[convId].map((m) => (m.id === id ? { ...m, isDeletedForEveryone: true, body: "" } : m));
          }
          return { messagesByConversation: next };
        });
      });

      socket.on("message_read", ({ conversationId }: { conversationId: string; messageId: string; userId: string }) => {
        set((state) => ({
          conversations: state.conversations.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
        }));
      });

      socket.on("user_online", ({ userId }: { userId: string }) => {
        set((state) => ({ onlineUserIds: new Set(state.onlineUserIds).add(userId) }));
      });

      socket.on("user_offline", ({ userId }: { userId: string }) => {
        set((state) => {
          const next = new Set(state.onlineUserIds);
          next.delete(userId);
          return { onlineUserIds: next };
        });
      });

      socket.on("typing_start", ({ conversationId, userId }: { conversationId: string; userId: string }) => {
        set((state) => {
          const current = new Set(state.typingByConversation[conversationId] ?? []);
          current.add(userId);
          return { typingByConversation: { ...state.typingByConversation, [conversationId]: current } };
        });
      });

      socket.on("typing_stop", ({ conversationId, userId }: { conversationId: string; userId: string }) => {
        set((state) => {
          const current = new Set(state.typingByConversation[conversationId] ?? []);
          current.delete(userId);
          return { typingByConversation: { ...state.typingByConversation, [conversationId]: current } };
        });
      });
    }

    if (!socket.connected) socket.connect();
  },

  disconnect: () => {
    const socket = getSocket();
    socket.disconnect();
    set({ connected: false });
  },

  setActiveConversation: (id) => {
    const prevId = get().activeConversationId;
    const socket = getSocket();
    if (prevId && prevId !== id) socket.emit("leave_conversation", prevId);
    if (id) socket.emit("join_conversation", id);
    set({ activeConversationId: id });
  },

  loadConversations: async () => {
    const conversations = await api.listConversations();
    set({ conversations });
  },

  loadMessages: async (conversationId, opts) => {
    const cursor = opts?.more ? get().nextCursorByConversation[conversationId] ?? undefined : undefined;
    const { messages, nextCursor } = await api.listMessages(conversationId, { cursor: cursor ?? undefined });
    set((state) => {
      const existing = opts?.more ? state.messagesByConversation[conversationId] ?? [] : [];
      // Server returns newest-first pages; render oldest-first.
      const merged = [...messages].reverse().concat(existing);
      const deduped = Array.from(new Map(merged.map((m) => [m.id, m])).values()).sort((a, b) =>
        a.createdAt < b.createdAt ? -1 : 1
      );
      return {
        messagesByConversation: { ...state.messagesByConversation, [conversationId]: deduped },
        nextCursorByConversation: { ...state.nextCursorByConversation, [conversationId]: nextCursor },
      };
    });
  },

  send: async (conversationId, body, replyToMessageId) => {
    const message = await api.sendMessage({ conversationId, body, replyToMessageId });
    set((state) => {
      const existing = state.messagesByConversation[conversationId] ?? [];
      if (existing.some((m) => m.id === message.id)) return state;
      return { messagesByConversation: { ...state.messagesByConversation, [conversationId]: [...existing, message] } };
    });
  },

  markConversationRead: async (conversationId) => {
    const messages = get().messagesByConversation[conversationId];
    const last = messages?.[messages.length - 1];
    if (!last) return;
    await api.markRead(conversationId, last.id);
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
    }));
  },

  startTyping: (conversationId) => {
    getSocket().emit("typing_start", conversationId);
  },

  stopTyping: (conversationId) => {
    getSocket().emit("typing_stop", conversationId);
  },
}));

export { conversationRoom };
