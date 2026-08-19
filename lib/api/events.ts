// Live Events + RSVP client -- talks to the real Express backend
// (backend/src/controllers/eventController.ts) via lib/api/client.ts's
// apiFetch. Replaces the previous JSON-mock client that called
// app/api/events/**; those route handlers and data/events/*.json are left
// in place untouched but no longer imported by any live UI code. Function
// names/signatures unchanged. submitRsvp intentionally does NOT require
// auth (matches the backend's public POST /events/:id/rsvp).
import { apiFetch } from "@/lib/api/client";
import type { CreateEventInput, CreateRsvpInput, EventRsvp, SchoolEvent, UpdateEventInput } from "@/lib/types/events";

export async function listEvents(): Promise<SchoolEvent[]> {
  return apiFetch<SchoolEvent[]>("/events", { cache: "no-store" });
}

export async function getEvent(id: string): Promise<SchoolEvent> {
  return apiFetch<SchoolEvent>(`/events/${id}`, { cache: "no-store" });
}

export async function createEvent(input: CreateEventInput): Promise<SchoolEvent> {
  return apiFetch<SchoolEvent>("/events", { method: "POST", json: input });
}

export async function updateEvent(id: string, input: UpdateEventInput): Promise<SchoolEvent> {
  return apiFetch<SchoolEvent>(`/events/${id}`, { method: "PATCH", json: input });
}

export async function deleteEvent(id: string): Promise<void> {
  await apiFetch<{ ok: true }>(`/events/${id}`, { method: "DELETE" });
}

export async function submitRsvp(eventId: string, input: Omit<CreateRsvpInput, "eventId">): Promise<EventRsvp> {
  return apiFetch<EventRsvp>(`/events/${eventId}/rsvp`, { method: "POST", json: input });
}

export async function listRsvps(eventId: string): Promise<EventRsvp[]> {
  return apiFetch<EventRsvp[]>(`/events/${eventId}/rsvp`, { cache: "no-store" });
}
