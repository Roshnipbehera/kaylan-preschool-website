// Live Events + RSVP client -- talks to the real Express backend
// (backend/src/controllers/eventController.ts) via lib/api/client.ts's
// apiFetch. If the backend is unreachable or in mock mode, it gracefully
// falls back to the curated events in data/events/events.json.
import { apiFetch, USE_MOCK_API } from "@/lib/api/client";
import type { CreateEventInput, CreateRsvpInput, EventRsvp, SchoolEvent, UpdateEventInput } from "@/lib/types/events";
import defaultEvents from "@/data/events/events.json";

export async function listEvents(): Promise<SchoolEvent[]> {
  if (USE_MOCK_API) {
    return defaultEvents as unknown as SchoolEvent[];
  }
  try {
    const data = await apiFetch<SchoolEvent[]>("/events", { cache: "no-store" });
    return data && data.length > 0 ? data : (defaultEvents as unknown as SchoolEvent[]);
  } catch (err) {
    console.warn("Events API unavailable, falling back to local events:", err);
    return defaultEvents as unknown as SchoolEvent[];
  }
}

export async function getEvent(id: string): Promise<SchoolEvent> {
  if (USE_MOCK_API) {
    const ev = (defaultEvents as unknown as SchoolEvent[]).find((e) => e.id === id);
    if (!ev) throw new Error("Event not found");
    return ev;
  }
  try {
    return await apiFetch<SchoolEvent>(`/events/${id}`, { cache: "no-store" });
  } catch (err) {
    const ev = (defaultEvents as unknown as SchoolEvent[]).find((e) => e.id === id);
    if (ev) return ev;
    throw err;
  }
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
