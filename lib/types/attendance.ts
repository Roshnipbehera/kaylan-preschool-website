// TypeScript interfaces for the Attendance system. Mirrors
// data/attendance/records.json and app/api/attendance/** route handlers.

export type AttendanceStatus = "present" | "absent" | "late";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // ISO date (yyyy-mm-dd)
  status: AttendanceStatus;
  markedBy: string;
  notes?: string;
}
