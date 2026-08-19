import { z } from "zod";

export const bulkAttendanceEntrySchema = z.object({
  studentId: z.string().min(1),
  status: z.enum(["present", "absent", "late"]),
  notes: z.string().optional(),
});

export const bulkAttendanceSchema = z.object({
  date: z.string().min(1, "Date is required"),
  markedBy: z.string().min(1, "Marked by is required"),
  entries: z.array(bulkAttendanceEntrySchema).min(1, "At least one student is required"),
});
export type BulkAttendanceInput = z.infer<typeof bulkAttendanceSchema>;
