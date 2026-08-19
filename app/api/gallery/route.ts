// Route handler backing the Gallery system. Persists all albums as a single
// array under data/gallery/albums.json. Structured to mirror
// app/api/blog/route.ts so Phase 3 wiring to a real backend is a drop-in swap.
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createGalleryAlbumSchema } from "@/lib/validation/gallery";
import { readAlbums, writeAlbums } from "./_store";
import type { GalleryAlbum } from "@/lib/types/gallery";

export async function GET() {
  try {
    const albums = await readAlbums();
    return NextResponse.json({ success: true, data: albums });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list albums" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createGalleryAlbumSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const albums = await readAlbums();
    if (albums.some((a) => a.slug === parsed.data.slug)) {
      return NextResponse.json({ success: false, message: "An album with this slug already exists" }, { status: 409 });
    }

    const now = new Date().toISOString();
    const album: GalleryAlbum = {
      id: randomUUID(),
      ...parsed.data,
      createdAt: now,
      updatedAt: now,
    };

    albums.push(album);
    await writeAlbums(albums);
    return NextResponse.json({ success: true, data: album }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to persist album" }, { status: 500 });
  }
}
