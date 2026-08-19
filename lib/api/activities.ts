// Live Daily Activities client -- talks to the real Express backend
// (backend/src/controllers/activityController.ts) via lib/api/client.ts's
// apiFetch. Replaces the previous JSON-mock client that called
// app/api/activities; that route handler and data/activities/logs.json are
// left in place untouched but no longer imported by any live UI code.
// Function names/signatures unchanged. Requires auth (the backend RBAC
// scopes results by role: parents see only their own children's logs,
// teachers see only their own class's, admin sees all).
import { apiFetch } from "@/lib/api/client";
import type { ActivityLog, CreateActivityLogInput } from "@/lib/types/activities";

export async function listActivityLogs(params: { studentId: string }): Promise<ActivityLog[]> {
  const qs = new URLSearchParams({ studentId: params.studentId });
  return apiFetch<ActivityLog[]>(`/activities?${qs.toString()}`, { cache: "no-store" });
}

export async function listActivityLogsForStudents(studentIds: string[]): Promise<ActivityLog[]> {
  if (studentIds.length === 0) return [];
  const qs = new URLSearchParams({ studentIds: studentIds.join(",") });
  return apiFetch<ActivityLog[]>(`/activities?${qs.toString()}`, { cache: "no-store" });
}

export async function createActivityLog(input: CreateActivityLogInput): Promise<ActivityLog> {
  return apiFetch<ActivityLog>("/activities", { method: "POST", json: input });
}
