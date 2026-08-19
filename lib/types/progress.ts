// TypeScript interfaces for the Teacher Progress Reports system. Mirrors
// data/progress/reports.json and app/api/progress/** route handlers.

export interface ProgressReport {
  id: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  period: string; // e.g. "Term 2, 2026"
  remarks: string;
  milestones: string[];
  createdAt: string;
}

export type CreateProgressReportInput = Omit<ProgressReport, "id" | "createdAt">;
