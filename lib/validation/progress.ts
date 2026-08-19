import { z } from "zod";

export const createProgressReportSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  teacherName: z.string().min(1, "Teacher name is required"),
  period: z.string().min(2, "Period is required"),
  remarks: z.string().min(5, "Remarks are required"),
  milestones: z.array(z.string().min(1)).min(1, "Add at least one milestone"),
});
export type CreateProgressReportFormValues = z.infer<typeof createProgressReportSchema>;
