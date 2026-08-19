// Live Students (Child Profile) client -- talks to the real Express
// backend (backend/src/controllers/studentController.ts) via
// lib/api/client.ts's apiFetch, following the same convention as
// lib/api/auth.ts / lib/api/users.ts / lib/api/messaging.ts.
//
// NOTE: this file replaces the previous JSON-mock client that called
// app/api/students/**. Those route handlers and data/students/students.json
// are left in place untouched but are no longer imported by any live UI
// code. Function names/signatures are unchanged so consuming components
// (AdminStudentsContent, TeacherStudentsContent, ChildProfileContent, etc.)
// needed no changes beyond this file.
import { apiFetch } from "@/lib/api/client";
import type { Student, UpdateStudentInput } from "@/lib/types/students";

export async function listStudents(params?: { parentUserId?: string; teacherUserId?: string }): Promise<Student[]> {
  const qs = new URLSearchParams();
  if (params?.parentUserId) qs.set("parentUserId", params.parentUserId);
  if (params?.teacherUserId) qs.set("teacherUserId", params.teacherUserId);
  const query = qs.toString();
  return apiFetch<Student[]>(`/students${query ? `?${query}` : ""}`);
}

export async function getStudent(id: string): Promise<Student> {
  return apiFetch<Student>(`/students/${id}`);
}

export async function updateStudent(id: string, input: UpdateStudentInput): Promise<Student> {
  return apiFetch<Student>(`/students/${id}`, { method: "PATCH", json: input });
}

// Admin-only additions below.
export type CreateStudentPayload = Omit<Student, "id" | "createdAt" | "updatedAt">;

export async function createStudent(input: CreateStudentPayload): Promise<Student> {
  return apiFetch<Student>(`/students`, { method: "POST", json: input });
}

export async function adminUpdateStudent(id: string, input: Partial<CreateStudentPayload>): Promise<Student> {
  return apiFetch<Student>(`/students/${id}`, { method: "PATCH", json: input });
}

export async function deleteStudent(id: string): Promise<Student> {
  return apiFetch<Student>(`/students/${id}`, { method: "DELETE" });
}
