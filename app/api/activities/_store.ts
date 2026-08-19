import { promises as fs } from "fs";
import path from "path";
import type { ActivityLog } from "@/lib/types/activities";

const DATA_DIR = path.join(process.cwd(), "data", "activities");
const LOGS_FILE = path.join(DATA_DIR, "logs.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readActivityLogs(): Promise<ActivityLog[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(LOGS_FILE, "utf-8");
    return JSON.parse(raw) as ActivityLog[];
  } catch {
    return [];
  }
}

export async function writeActivityLogs(logs: ActivityLog[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
}
