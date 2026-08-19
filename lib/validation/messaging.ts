import { z } from "zod";

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation is required"),
  senderId: z.string().min(1, "Sender is required"),
  senderRole: z.enum(["parent", "teacher", "admin"]),
  senderName: z.string().min(1, "Sender name is required"),
  body: z.string().min(1, "Message cannot be empty").max(2000, "Message is too long"),
  attachments: z
    .array(z.object({ name: z.string(), url: z.string() }))
    .optional(),
});
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export const markReadSchema = z.object({
  userId: z.string().min(1),
});
export type MarkReadInput = z.infer<typeof markReadSchema>;

export const createConversationSchema = z
  .object({
    studentId: z.string().min(1, "Student is required"),
    parentUserId: z.string().min(1, "Parent is required"),
    teacherUserId: z.string().min(1).optional(),
    teacherName: z.string().min(1).optional(),
    adminUserId: z.string().min(1).optional(),
    adminName: z.string().min(1).optional(),
    subject: z.string().min(1, "Subject is required").max(200),
  })
  .refine((v) => Boolean(v.teacherUserId) || Boolean(v.adminUserId), {
    message: "A conversation must have either a teacher or an admin participant",
    path: ["teacherUserId"],
  });
export type CreateConversationFormInput = z.infer<typeof createConversationSchema>;
