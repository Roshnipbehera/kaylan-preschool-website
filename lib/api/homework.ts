// Live Homework client -- talks to the real Express backend
// (backend/src/controllers/homeworkController.ts) via lib/api/client.ts's
// apiFetch. Replaces the previous JSON-mock client that called
// app/api/homework/**; those route handlers and
// data/homework/assignments.json are left in place untouched but no longer
// imported by any live UI code. Function names/signatures unchanged.
import { apiFetch } from "@/lib/api/client";
import type { CreateHomeworkInput, Homework, HomeworkStatus, UpdateHomeworkInput } from "@/lib/types/homework";

export async function listHomework(params?: { className?: string; teacherId?: string }): Promise<Homework[]> {
  const qs = new URLSearchParams();
  if (params?.className) qs.set("className", params.className);
  if (params?.teacherId) qs.set("teacherId", params.teacherId);
  const query = qs.toString();
  return apiFetch<Homework[]>(`/homework${query ? `?${query}` : ""}`);
}

export async function updateHomeworkStatus(id: string, status: HomeworkStatus): Promise<Homework> {
  return apiFetch<Homework>(`/homework/${id}`, { method: "PATCH", json: { status } });
}

export async function createHomework(input: CreateHomeworkInput): Promise<Homework> {
  return apiFetch<Homework>("/homework", { method: "POST", json: input });
}

export async function updateHomework(id: string, input: UpdateHomeworkInput): Promise<Homework> {
  return apiFetch<Homework>(`/homework/${id}`, { method: "PATCH", json: input });
}

export async function deleteHomework(id: string): Promise<Homework> {
  return apiFetch<Homework>(`/homework/${id}`, { method: "DELETE" });
}
