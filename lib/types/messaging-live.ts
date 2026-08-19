// Types for the REAL backend messaging domain (backend/src/controllers/
// conversationController.ts, messageController.ts, backend/prisma/schema.prisma).
// Distinct from lib/types/messaging.ts, which mirrors the OLD JSON-mock shape
// still used by app/api/messaging/** (left untouched). Do not merge these --
// the shapes are meaningfully different (participants[] vs
// parentUserId/teacherUserId, cursor pagination, reactions, etc.).

export type LiveRole = "parent" | "teacher" | "admin";

export interface LiveParticipant {
  id: string;
  name: string;
  role: LiveRole;
  avatarUrl?: string | null;
}

export interface LiveAttachment {
  id: string;
  messageId: string;
  url: string;
  type: "image" | "file";
  filename: string;
  size: number;
  mimeType: string;
}

export interface LiveReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
}

export interface LiveReadReceipt {
  id: string;
  messageId: string;
  userId: string;
  readAt: string;
}

export interface LiveMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: LiveParticipant;
  body: string;
  replyToMessageId?: string | null;
  isEdited: boolean;
  editedAt?: string | null;
  isPinned: boolean;
  isDeletedForEveryone: boolean;
  attachments: LiveAttachment[];
  reactions?: LiveReaction[];
  readReceipts?: LiveReadReceipt[];
  createdAt: string;
}

export interface LiveConversation {
  id: string;
  subject?: string | null;
  participants: LiveParticipant[];
  lastMessage: LiveMessage | null;
  isArchived: boolean;
  isPinned: boolean;
  isMuted: boolean;
  unreadCount: number;
  updatedAt: string;
}

export interface ListMessagesResult {
  messages: LiveMessage[];
  nextCursor: string | null;
}
