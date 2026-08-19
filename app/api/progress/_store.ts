import { promises as fs } from "fs";
import path from "path";
import type { ProgressReport } from "@/lib/types/progress";

const DATA_DIR = path.join(process.cwd(), "data", "progress");
const REPORTS_FILE = path.join(DATA_DIR, "reports.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readProgressReports(): Promise<ProgressReport[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(REPORTS_FILE, "utf-8");
    return JSON.parse(raw) as ProgressReport[];
  } catch {
    return [];
  }
}

export async function writeProgressReports(reports: ProgressReport[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2), "utf-8");
}
