import { promises as fs } from "fs";
import path from "path";
import type { Announcement } from "@/lib/types/announcements";

const DATA_DIR = path.join(process.cwd(), "data", "announcements");
const FILE = path.join(DATA_DIR, "announcements.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readAnnouncements(): Promise<Announcement[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as Announcement[];
  } catch {
    return [];
  }
}

export async function writeAnnouncements(announcements: Announcement[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(FILE, JSON.stringify(announcements, null, 2), "utf-8");
}
