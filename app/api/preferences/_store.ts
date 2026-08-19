import { promises as fs } from "fs";
import path from "path";
import type { NotificationPreferences } from "@/lib/types";

export interface UserPreferences extends NotificationPreferences {
  userId: string;
}

const DATA_DIR = path.join(process.cwd(), "data", "users");
const PREFS_FILE = path.join(DATA_DIR, "preferences.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readPreferences(): Promise<UserPreferences[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(PREFS_FILE, "utf-8");
    return JSON.parse(raw) as UserPreferences[];
  } catch {
    return [];
  }
}

export async function writePreferences(prefs: UserPreferences[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(PREFS_FILE, JSON.stringify(prefs, null, 2), "utf-8");
}
