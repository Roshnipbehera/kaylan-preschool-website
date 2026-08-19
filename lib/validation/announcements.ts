import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z.string().min(2, "Title is required"),
  body: z.string().min(2, "Body is required"),
  date: z.string().min(1, "Date is required"),
  audience: z.enum(["all", "parents", "teachers"]),
  classId: z.string().optional(),
  createdBy: z.string().optional(),
});
export type CreateAnnouncementFormValues = z.infer<typeof createAnnouncementSchema>;
