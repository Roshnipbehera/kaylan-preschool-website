// Shared JSON persistence helpers for the Students (Child Profile) domain.
// Persists all students as a single array under data/students/students.json,
// mirroring the collection-persistence approach used by app/api/blog/_store.ts
// and app/api/events/_store.ts.
import { promises as fs } from "fs";
import path from "path";
import type { Student } from "@/lib/types/students";

const DATA_DIR = path.join(process.cwd(), "data", "students");
const STUDENTS_FILE = path.join(DATA_DIR, "students.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readStudents(): Promise<Student[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(STUDENTS_FILE, "utf-8");
    return JSON.parse(raw) as Student[];
  } catch {
    return [];
  }
}

export async function writeStudents(students: Student[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(STUDENTS_FILE, JSON.stringify(students, null, 2), "utf-8");
}
