// Route handler backing the Blog system. Persists all posts as a single
// array under data/blog/posts.json. Structured to mirror what a real
// backend REST endpoint (GET/POST /api/v1/blog) would look like, so Phase 3
// wiring is a drop-in swap.
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createBlogPostSchema } from "@/lib/validation/blog";
import { readPosts, writePosts } from "../blog/_store";
import type { BlogPost } from "@/lib/types/blog";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase();
    const authorId = searchParams.get("authorId");
    const publishedOnly = searchParams.get("publishedOnly") === "true";

    let posts = await readPosts();
    if (category) posts = posts.filter((p) => p.category === category);
    if (authorId) posts = posts.filter((p) => p.authorId === authorId);
    if (publishedOnly) posts = posts.filter((p) => p.published);
    if (search) {
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.excerpt.toLowerCase().includes(search) ||
          p.tags.some((t) => t.toLowerCase().includes(search)),
      );
    }
    posts = posts.sort((a, b) => ((a.publishedAt ?? a.createdAt) < (b.publishedAt ?? b.createdAt) ? 1 : -1));

    return NextResponse.json({ success: true, data: posts });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createBlogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const posts = await readPosts();
    if (posts.some((p) => p.slug === parsed.data.slug)) {
      return NextResponse.json({ success: false, message: "A post with this slug already exists" }, { status: 409 });
    }

    const now = new Date().toISOString();
    const post: BlogPost = {
      id: randomUUID(),
      ...parsed.data,
      publishedAt: parsed.data.published ? parsed.data.publishedAt ?? now : undefined,
      createdAt: now,
      updatedAt: now,
    };

    posts.push(post);
    await writePosts(posts);
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to persist post" }, { status: 500 });
  }
}
