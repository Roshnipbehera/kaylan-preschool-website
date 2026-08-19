import { z } from "zod";

export const createActivityLogSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  category: z.enum(["learning", "play", "meal", "nap", "art", "outdoor"]),
  title: z.string().min(2, "Title is required"),
  notes: z.string().optional(),
  loggedBy: z.string().min(1, "Logged by is required"),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(["image", "video"]).optional(),
});
export type CreateActivityLogFormValues = z.infer<typeof createActivityLogSchema>;
