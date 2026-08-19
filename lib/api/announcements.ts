// Live Announcements client -- talks to the real Express backend
// (backend/src/controllers/announcementController.ts) via
// lib/api/client.ts's apiFetch. Replaces the previous JSON-mock client
// that called app/api/announcements; that route handler and
// data/announcements/announcements.json are left in place untouched but no
// longer imported by any live UI code. Function names/signatures
// unchanged. Requires auth (the backend RBAC scopes results by role +
// classId audience filtering).
import { apiFetch } from "@/lib/api/client";
import type { Announcement, CreateAnnouncementInput } from "@/lib/types/announcements";

export async function listAnnouncements(): Promise<Announcement[]> {
  return apiFetch<Announcement[]>("/announcements", { cache: "no-store" });
}

export async function createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
  return apiFetch<Announcement>("/announcements", { method: "POST", json: input });
}
