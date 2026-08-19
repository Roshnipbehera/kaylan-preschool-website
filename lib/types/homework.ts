// TypeScript interfaces for the Homework system. Mirrors
// data/homework/assignments.json and app/api/homework/** route handlers.

export type HomeworkStatus = "pending" | "submitted" | "overdue";

export interface Homework {
  id: string;
  className: string;
  subject: string;
  title: string;
  description: string;
  assignedDate: string; // ISO date
  dueDate: string; // ISO date
  status: HomeworkStatus;
  teacherId?: string;
}

export type CreateHomeworkInput = Omit<Homework, "id">;
export type UpdateHomeworkInput = Partial<Omit<Homework, "id">>;
