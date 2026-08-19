// Live Attendance client -- talks to the real Express backend
// (backend/src/controllers/attendanceController.ts) via lib/api/client.ts's
// apiFetch. Replaces the previous JSON-mock client that called
// app/api/attendance/**; those route handlers and
// data/attendance/records.json are left in place untouched but no longer
// imported by any live UI code. Function names/signatures unchanged.
import { apiFetch } from "@/lib/api/client";
import type { AttendanceRecord, AttendanceStatus } from "@/lib/types/attendance";

export async function listAttendance(params: {
  studentId?: string;
  month?: string;
  date?: string;
  className?: string;
}): Promise<AttendanceRecord[]> {
  const qs = new URLSearchParams();
  if (params.studentId) qs.set("studentId", params.studentId);
  if (params.month) qs.set("month", params.month);
  if (params.date) qs.set("date", params.date);
  if (params.className) qs.set("className", params.className);
  return apiFetch<AttendanceRecord[]>(`/attendance?${qs.toString()}`);
}

// Bulk mark/upsert attendance for a whole class on a given date -- used by
// the Teacher Dashboard's daily attendance sheet.
export async function bulkMarkAttendance(input: {
  date: string;
  markedBy: string;
  entries: Array<{ studentId: string; status: AttendanceStatus; notes?: string }>;
}): Promise<AttendanceRecord[]> {
  return apiFetch<AttendanceRecord[]>("/attendance", { method: "POST", json: input });
}
