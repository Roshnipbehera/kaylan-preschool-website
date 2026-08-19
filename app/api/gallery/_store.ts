// Shared JSON persistence helpers for the Gallery system. Albums (with
// nested items) are persisted as a single array under
// data/gallery/albums.json, mirroring the collection-persistence approach
// established by app/api/blog/_store.ts.
import { promises as fs } from "fs";
import path from "path";
import type { GalleryAlbum } from "@/lib/types/gallery";

const DATA_DIR = path.join(process.cwd(), "data", "gallery");
const ALBUMS_FILE = path.join(DATA_DIR, "albums.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readAlbums(): Promise<GalleryAlbum[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(ALBUMS_FILE, "utf-8");
    return JSON.parse(raw) as GalleryAlbum[];
  } catch {
    return [];
  }
}

export async function writeAlbums(albums: GalleryAlbum[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(ALBUMS_FILE, JSON.stringify(albums, null, 2), "utf-8");
}
