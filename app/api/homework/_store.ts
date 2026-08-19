import { promises as fs } from "fs";
import path from "path";
import type { Homework } from "@/lib/types/homework";

const DATA_DIR = path.join(process.cwd(), "data", "homework");
const ASSIGNMENTS_FILE = path.join(DATA_DIR, "assignments.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readHomework(): Promise<Homework[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(ASSIGNMENTS_FILE, "utf-8");
    return JSON.parse(raw) as Homework[];
  } catch {
    return [];
  }
}

export async function writeHomework(assignments: Homework[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(ASSIGNMENTS_FILE, JSON.stringify(assignments, null, 2), "utf-8");
}
