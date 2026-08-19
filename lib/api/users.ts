// Live Admin User-Management API client -- talks to the real Express
// backend (backend/src/controllers/userController.ts's admin CRUD
// handlers) via lib/api/client.ts's apiFetch, following the same
// convention as lib/api/auth.ts / lib/api/messaging.ts. Every exported
// function here maps 1:1 to an endpoint that actually exists in
// backend/src/routes/userRoutes.ts (all admin-only, requireRole("admin")).
//
// NOTE: this file replaces the previous JSON-mock client that called
// app/api/users/**. Those route handlers and data/users/users.json are
// left in place untouched but are no longer imported by any live UI code.
import { apiFetch } from "@/lib/api/client";
import type { ManagedUser, CreateUserInput, UpdateUserInput, CreateUserResult } from "@/lib/types/users";
import type { Role } from "@/lib/types/index";

export async function listUsers(role?: Role): Promise<ManagedUser[]> {
  const qs = role ? `?role=${encodeURIComponent(role)}` : "";
  return apiFetch<ManagedUser[]>(`/users${qs}`);
}

export async function getUser(id: string): Promise<ManagedUser> {
  return apiFetch<ManagedUser>(`/users/${id}`);
}

export async function createUser(input: CreateUserInput): Promise<CreateUserResult> {
  return apiFetch<CreateUserResult>(`/users`, { method: "POST", json: input });
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<ManagedUser> {
  return apiFetch<ManagedUser>(`/users/${id}`, { method: "PATCH", json: input });
}

// Soft-delete: the backend flips isActive to false rather than deleting the
// row (Message/Conversation/RefreshToken/Student FKs reference User), so
// this is functionally the same action as toggling `isActive: false` via
// updateUser -- kept as its own function to match the existing "Trash2"
// delete-button call site in AdminTeachersContent.tsx / AdminParentsContent.tsx.
export async function deleteUser(id: string): Promise<ManagedUser> {
  return apiFetch<ManagedUser>(`/users/${id}`, { method: "DELETE" });
}
