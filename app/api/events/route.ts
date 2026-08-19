// Route handler backing the Events system. Persists all events as a single
// array under data/events/events.json. Structured to mirror
// app/api/blog/route.ts / app/api/gallery/route.ts so Phase 3 wiring to a
// real backend is a drop-in swap.
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createEventSchema } from "@/lib/validation/events";
import { readEvents, writeEvents } from "./_store";
import type { SchoolEvent } from "@/lib/types/events";

export async function GET() {
  try {
    const events = await readEvents();
    const sorted = [...events].sort((a, b) => (a.date < b.date ? -1 : 1));
    return NextResponse.json({ success: true, data: sorted });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const events = await readEvents();
    const now = new Date().toISOString();
    const event: SchoolEvent = {
      id: randomUUID(),
      ...parsed.data,
      createdAt: now,
      updatedAt: now,
    };

    events.push(event);
    await writeEvents(events);
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to persist event" }, { status: 500 });
  }
}
