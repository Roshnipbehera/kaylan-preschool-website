import { promises as fs } from "fs";
import path from "path";
import type { ManagedUser } from "@/lib/types/users";

const DATA_DIR = path.join(process.cwd(), "data", "users");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readUsers(): Promise<ManagedUser[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(raw) as ManagedUser[];
  } catch {
    return [];
  }
}

export async function writeUsers(users: ManagedUser[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}
