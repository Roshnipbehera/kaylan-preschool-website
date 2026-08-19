import { z } from "zod";

export const createConversationSchema = z.object({
  participantIds: z.array(z.string().min(1)).min(1).max(1),
  subject: z.string().max(200).optional(),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1),
  body: z.string().min(1).max(5000),
  replyToMessageId: z.string().min(1).optional(),
});

export const editMessageSchema = z.object({
  body: z.string().min(1).max(5000),
});

export const reactionSchema = z.object({
  emoji: z.string().min(1).max(8),
});

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(30),
});
