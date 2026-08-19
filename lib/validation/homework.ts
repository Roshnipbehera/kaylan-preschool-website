import { z } from "zod";

export const createHomeworkSchema = z.object({
  className: z.string().min(1, "Class is required"),
  subject: z.string().min(1, "Subject is required"),
  title: z.string().min(2, "Title is required"),
  description: z.string().min(2, "Description is required"),
  assignedDate: z.string().min(1, "Assigned date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["pending", "submitted", "overdue"]).default("pending"),
  teacherId: z.string().optional(),
});
export type CreateHomeworkFormValues = z.infer<typeof createHomeworkSchema>;

export const updateHomeworkFullSchema = createHomeworkSchema.partial();
export type UpdateHomeworkFormValues = z.infer<typeof updateHomeworkFullSchema>;
