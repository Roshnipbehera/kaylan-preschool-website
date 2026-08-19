import { promises as fs } from "fs";
import path from "path";
import type { DownloadDocument } from "@/lib/types/downloads";

const DATA_DIR = path.join(process.cwd(), "data", "downloads");
const FILE = path.join(DATA_DIR, "documents.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readDownloadDocuments(): Promise<DownloadDocument[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as DownloadDocument[];
  } catch {
    return [];
  }
}
