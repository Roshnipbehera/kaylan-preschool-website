import { NextRequest, NextResponse } from "next/server";
import { updateEventSchema } from "@/lib/validation/events";
import { readEvents, writeEvents } from "../_store";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const events = await readEvents();
    const event = events.find((e) => e.id === params.id);
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: event });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to load event" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const events = await readEvents();
    const idx = events.findIndex((e) => e.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    const updated = { ...events[idx], ...parsed.data, updatedAt: new Date().toISOString() };
    events[idx] = updated;
    await writeEvents(events);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const events = await readEvents();
    const next = events.filter((e) => e.id !== params.id);
    if (next.length === events.length) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }
    await writeEvents(next);
    return NextResponse.json({ success: true, data: { ok: true } });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete event" }, { status: 500 });
  }
}
