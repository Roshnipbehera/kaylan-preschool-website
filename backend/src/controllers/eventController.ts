import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { notifyUsers } from "../lib/notify";
import { logAudit } from "../lib/audit";

// Live Events + RSVP CRUD (Batch 3 migration pass). Replaces the legacy
// Mongoose-backed scaffold (../models/Event.ts, ../models/Rsvp.ts -- dead
// code from the pre-Prisma architecture pass, never wired to a live DB
// in this sandbox -- see backend/README.md, left in place as harmless
// dead code, nothing imports it any more) AND app/api/events/**
// (JSON-backed, data/events/{events,rsvps}.json). Response shape mirrors
// lib/types/events.ts's SchoolEvent/EventRsvp exactly. Reads (list/
// detail) and RSVP submission are public -- parents/visitors RSVP without
// being logged in. Create/update/delete of events and the per-event RSVP
// list are admin-only.

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  location: z.string().min(1),
  coverImage: z.string().optional(),
});
const updateEventSchema = createEventSchema.partial();

const createRsvpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  guests: z.number().int().min(1).default(1),
});

type EventRow = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
};
function toEventDto(row: EventRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date.toISOString(),
    location: row.location,
    coverImage: row.coverImage ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

type RsvpRow = { id: string; eventId: string; name: string; email: string; guests: number; submittedAt: Date };
function toRsvpDto(row: RsvpRow) {
  return {
    id: row.id,
    eventId: row.eventId,
    name: row.name,
    email: row.email,
    guests: row.guests,
    submittedAt: row.submittedAt.toISOString(),
  };
}

export async function listEvents(_req: Request, res: Response) {
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
  // Public events calendar -- no per-user data in the response.
  res.set("Cache-Control", "public, max-age=60");
  res.json({ success: true, data: events.map((e) => toEventDto(e as EventRow)) });
}

export async function getEventById(req: Request, res: Response) {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!event) throw new AppError("Event not found", 404);
  res.set("Cache-Control", "public, max-age=60");
  res.json({ success: true, data: toEventDto(event as EventRow) });
}

export async function createEvent(req: Request, res: Response) {
  const data = createEventSchema.parse(req.body);
  const event = await prisma.event.create({ data: { ...data, date: new Date(data.date) } });

  const recipients = await prisma.user.findMany({ where: { role: { in: ["PARENT", "TEACHER"] } }, select: { id: true } });
  if (recipients.length) {
    await notifyUsers(
      recipients.map((r: { id: string }) => r.id),
      {
        type: "EVENT",
        title: "New school event",
        body: `${event.title} on ${event.date.toDateString()} at ${event.location}.`,
        relatedEntityType: "Event",
        relatedEntityId: event.id,
      },
    );
  }

  await logAudit(req, { action: "event.create", category: "general", entity: "Event", entityId: event.id, metadata: { title: event.title } });
  res.status(201).json({ success: true, data: toEventDto(event as EventRow) });
}

export async function updateEvent(req: Request, res: Response) {
  const data = updateEventSchema.parse(req.body);
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: { ...data, date: data.date ? new Date(data.date) : undefined },
    });
    await logAudit(req, { action: "event.update", category: "general", entity: "Event", entityId: event.id });
    res.json({ success: true, data: toEventDto(event as EventRow) });
  } catch {
    throw new AppError("Event not found", 404);
  }
}

export async function deleteEvent(req: Request, res: Response) {
  try {
    const deleted = await prisma.event.delete({ where: { id: req.params.id } });
    await logAudit(req, { action: "event.delete", category: "general", entity: "Event", entityId: deleted.id, metadata: { title: deleted.title } });
    res.json({ success: true, data: { ok: true } });
  } catch {
    throw new AppError("Event not found", 404);
  }
}

export async function createRsvp(req: Request, res: Response) {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!event) throw new AppError("Event not found", 404);
  const data = createRsvpSchema.parse(req.body);
  const rsvp = await prisma.eventRsvp.create({ data: { eventId: event.id, ...data } });
  res.status(201).json({ success: true, data: toRsvpDto(rsvp as RsvpRow) });
}

export async function listRsvps(req: Request, res: Response) {
  const rsvps = await prisma.eventRsvp.findMany({
    where: { eventId: req.params.id },
    orderBy: { submittedAt: "desc" },
  });
  res.json({ success: true, data: rsvps.map((r) => toRsvpDto(r as RsvpRow)) });
}
