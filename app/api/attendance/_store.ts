import { promises as fs } from "fs";
import path from "path";
import type { AttendanceRecord } from "@/lib/types/attendance";

const DATA_DIR = path.join(process.cwd(), "data", "attendance");
const RECORDS_FILE = path.join(DATA_DIR, "records.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readAttendanceRecords(): Promise<AttendanceRecord[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(RECORDS_FILE, "utf-8");
    return JSON.parse(raw) as AttendanceRecord[];
  } catch {
    return [];
  }
}

export async function writeAttendanceRecords(records: AttendanceRecord[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(RECORDS_FILE, JSON.stringify(records, null, 2), "utf-8");
}
