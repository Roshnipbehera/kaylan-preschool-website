import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAnnouncementSchema } from "@/lib/validation/announcements";
import { readAnnouncements, writeAnnouncements } from "./_store";
import type { Announcement } from "@/lib/types/announcements";

export async function GET() {
  try {
    const announcements = await readAnnouncements();
    const sorted = [...announcements].sort((a, b) => (a.date < b.date ? 1 : -1));
    return NextResponse.json({ success: true, data: sorted });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list announcements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createAnnouncementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const announcements = await readAnnouncements();
    const announcement: Announcement = { id: randomUUID(), ...parsed.data };
    announcements.push(announcement);
    await writeAnnouncements(announcements);
    return NextResponse.json({ success: true, data: announcement }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to create announcement" }, { status: 500 });
  }
}
