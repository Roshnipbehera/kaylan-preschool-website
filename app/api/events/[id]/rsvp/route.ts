// RSVP sub-resource for a single event. POST persists a new RSVP linked by
// eventId to data/events/rsvps.json and mock-simulates a confirmation email
// (console.log "[MOCK EMAIL]"). GET lists all RSVPs for the event (used by
// the admin dashboard).
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { rsvpSchema } from "@/lib/validation/events";
import { readEvents, readRsvps, writeRsvps } from "../../_store";
import type { EventRsvp } from "@/lib/types/events";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rsvps = await readRsvps();
    const forEvent = rsvps.filter((r) => r.eventId === params.id);
    return NextResponse.json({ success: true, data: forEvent });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list RSVPs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = rsvpSchema.safeParse({ ...(body as object), eventId: params.id });
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const events = await readEvents();
    const event = events.find((e) => e.id === params.id);
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    const rsvps = await readRsvps();
    const rsvp: EventRsvp = {
      id: randomUUID(),
      ...parsed.data,
      submittedAt: new Date().toISOString(),
    };
    rsvps.push(rsvp);
    await writeRsvps(rsvps);

    // Mock-simulate a confirmation email (real send would use
    // backend/src/emails/eventEmails.ts + Nodemailer in Phase 3).
    console.log(
      `[MOCK EMAIL] To: ${rsvp.email} | Subject: RSVP Confirmed for ${event.title} | Guests: ${rsvp.guests}`,
    );

    return NextResponse.json({ success: true, data: rsvp }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to persist RSVP" }, { status: 500 });
  }
}
