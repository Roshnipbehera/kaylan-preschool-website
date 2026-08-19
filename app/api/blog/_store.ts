// Shared JSON persistence helpers for the Blog system. Posts are persisted
// as a single array under data/blog/posts.json (a collection, unlike the
// per-file pattern used for admissions) since list/filter operations are
// the primary access pattern for a blog. Mirrors the collection-persistence
// approach established by app/api/admissions/route.ts.
import { promises as fs } from "fs";
import path from "path";
import type { BlogAuthor, BlogPost } from "@/lib/types/blog";

const DATA_DIR = path.join(process.cwd(), "data", "blog");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");
const AUTHORS_FILE = path.join(DATA_DIR, "authors.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readPosts(): Promise<BlogPost[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(POSTS_FILE, "utf-8");
    return JSON.parse(raw) as BlogPost[];
  } catch {
    return [];
  }
}

export async function writePosts(posts: BlogPost[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

export async function readAuthors(): Promise<BlogAuthor[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(AUTHORS_FILE, "utf-8");
    return JSON.parse(raw) as BlogAuthor[];
  } catch {
    return [];
  }
}
