// Shared JSON persistence helpers for the Events system. Events and RSVPs
// are each persisted as a single array under data/events/events.json and
// data/events/rsvps.json, mirroring the collection-persistence approach
// established by app/api/blog/_store.ts and app/api/gallery/_store.ts.
import { promises as fs } from "fs";
import path from "path";
import type { EventRsvp, SchoolEvent } from "@/lib/types/events";

const DATA_DIR = path.join(process.cwd(), "data", "events");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");
const RSVPS_FILE = path.join(DATA_DIR, "rsvps.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readEvents(): Promise<SchoolEvent[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(EVENTS_FILE, "utf-8");
    return JSON.parse(raw) as SchoolEvent[];
  } catch {
    return [];
  }
}

export async function writeEvents(events: SchoolEvent[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2), "utf-8");
}

export async function readRsvps(): Promise<EventRsvp[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(RSVPS_FILE, "utf-8");
    return JSON.parse(raw) as EventRsvp[];
  } catch {
    return [];
  }
}

export async function writeRsvps(rsvps: EventRsvp[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(RSVPS_FILE, JSON.stringify(rsvps, null, 2), "utf-8");
}
