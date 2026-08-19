import { NextRequest, NextResponse } from "next/server";
import { readAuthors, readPosts } from "../../_store";

export async function GET(_req: NextRequest, { params }: { params: { authorSlug: string } }) {
  try {
    const authors = await readAuthors();
    const author = authors.find((a) => a.slug === params.authorSlug);
    if (!author) {
      return NextResponse.json({ success: false, message: "Author not found" }, { status: 404 });
    }
    const posts = await readPosts();
    const authorPosts = posts
      .filter((p) => p.authorId === author.id && p.published)
      .sort((a, b) => ((a.publishedAt ?? a.createdAt) < (b.publishedAt ?? b.createdAt) ? 1 : -1));

    return NextResponse.json({ success: true, data: { author, posts: authorPosts } });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to load author" }, { status: 500 });
  }
}
