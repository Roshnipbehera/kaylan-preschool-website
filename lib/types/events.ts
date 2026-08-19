// TypeScript interfaces for the Events system. Mirrors the JSON persisted
// under data/events/events.json and data/events/rsvps.json, and the shape
// returned by app/api/events/** route handlers.

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO datetime
  location: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventRsvp {
  id: string;
  eventId: string;
  name: string;
  email: string;
  guests: number;
  submittedAt: string;
}

export type CreateEventInput = Omit<SchoolEvent, "id" | "createdAt" | "updatedAt">;
export type UpdateEventInput = Partial<CreateEventInput>;
export type CreateRsvpInput = Omit<EventRsvp, "id" | "submittedAt">;
