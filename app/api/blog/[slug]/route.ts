import { NextRequest, NextResponse } from "next/server";
import { updateBlogPostSchema } from "@/lib/validation/blog";
import { readPosts, writePosts } from "../_store";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const posts = await readPosts();
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: post });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to load post" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateBlogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const posts = await readPosts();
    const idx = posts.findIndex((p) => p.slug === params.slug);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    const existing = posts[idx];
    const nowPublishing = parsed.data.published && !existing.published;
    const updated = {
      ...existing,
      ...parsed.data,
      tags: parsed.data.tags ?? existing.tags,
      publishedAt: nowPublishing ? new Date().toISOString() : parsed.data.publishedAt ?? existing.publishedAt,
      updatedAt: new Date().toISOString(),
    };

    posts[idx] = updated;
    await writePosts(posts);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const posts = await readPosts();
    const next = posts.filter((p) => p.slug !== params.slug);
    if (next.length === posts.length) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }
    await writePosts(next);
    return NextResponse.json({ success: true, data: { ok: true } });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete post" }, { status: 500 });
  }
}
