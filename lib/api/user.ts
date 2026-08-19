// MOCK user/profile/settings API. Same swap-later contract as lib/api/auth.ts.

import { mockDelay, USE_MOCK_API, apiFetch } from "@/lib/api/client";
import type { AttendanceRecord, NotificationPreferences, UpcomingEvent, User, UpcomingEvent as Ev } from "@/lib/types";

export async function updateProfile(input: { name: string; email: string; phone?: string }): Promise<Partial<User>> {
  if (!USE_MOCK_API) {
    return apiFetch("/users/me", { method: "PATCH", json: input });
  }
  await mockDelay();
  return { name: input.name, email: input.email };
}

export async function changePassword(_input: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
  if (!USE_MOCK_API) {
    return apiFetch("/users/me/password", { method: "PATCH", json: _input });
  }
  await mockDelay();
  return { message: "Password updated successfully." };
}

// Notification preferences are persisted for real via the Next.js route
// handler at app/api/preferences (backed by data/users/preferences.json),
// independent of the NEXT_PUBLIC_USE_MOCK_API flag -- this is first-party
// app data, not the external backend integration boundary.
async function parsePrefsJson<T>(res: Response): Promise<T> {
  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload || payload.success === false) {
    throw new Error(payload?.message ?? res.statusText ?? "Preferences request failed");
  }
  return payload.data as T;
}

export async function getSettings(userId: string): Promise<NotificationPreferences> {
  const res = await fetch(`/api/preferences?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
  return parsePrefsJson<NotificationPreferences>(res);
}

export async function updateSettings(userId: string, input: NotificationPreferences): Promise<NotificationPreferences> {
  const res = await fetch(`/api/preferences?userId=${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parsePrefsJson<NotificationPreferences>(res);
}

export async function getAttendance(): Promise<AttendanceRecord[]> {
  if (!USE_MOCK_API) {
    return apiFetch("/users/me/attendance");
  }
  await mockDelay(600);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return days.map((d, i) => ({ date: d, status: i === 2 ? "late" : "present" }));
}

export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  if (!USE_MOCK_API) {
    return apiFetch("/users/me/events");
  }
  await mockDelay(600);
  const events: Ev[] = [
    { id: "e1", title: "Annual Sports Day", date: "2026-08-15", description: "Fun races and games on the front lawn." },
    { id: "e2", title: "Parent-Teacher Meet", date: "2026-08-22", description: "One-on-one progress discussion." },
    { id: "e3", title: "Storybook Costume Day", date: "2026-09-05", description: "Come dressed as your favourite character!" },
  ];
  return events;
}
