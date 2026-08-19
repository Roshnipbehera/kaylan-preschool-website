// TypeScript interfaces for the Teacher Messages system. Mirrors
// data/messaging/conversations.json and data/messaging/messages.json.

import type { Role } from "@/lib/types";

export interface MessageAttachment {
  name: string;
  url: string;
}

export interface Conversation {
  id: string;
  studentId: string;
  parentUserId: string;
  // Teacher<->Parent conversations populate these.
  teacherUserId?: string;
  teacherName?: string;
  // Admin<->Parent conversations populate these instead. A conversation is
  // additively either teacher-led or admin-led (or, in principle, both).
  adminUserId?: string;
  adminName?: string;
  subject: string;
  createdAt: string;
}

export type CreateConversationInput = {
  studentId: string;
  parentUserId: string;
  teacherUserId?: string;
  teacherName?: string;
  adminUserId?: string;
  adminName?: string;
  subject: string;
};

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: Role;
  senderName: string;
  body: string;
  attachments: MessageAttachment[];
  readBy: string[];
  createdAt: string;
}

export type SendMessageInput = {
  conversationId: string;
  senderId: string;
  senderRole: Role;
  senderName: string;
  body: string;
  attachments?: MessageAttachment[];
};
