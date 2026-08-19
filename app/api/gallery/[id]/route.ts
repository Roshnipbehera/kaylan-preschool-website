import { NextRequest, NextResponse } from "next/server";
import { updateGalleryAlbumSchema } from "@/lib/validation/gallery";
import { readAlbums, writeAlbums } from "../_store";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const albums = await readAlbums();
    const album = albums.find((a) => a.id === params.id || a.slug === params.id);
    if (!album) {
      return NextResponse.json({ success: false, message: "Album not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: album });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to load album" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateGalleryAlbumSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const albums = await readAlbums();
    const idx = albums.findIndex((a) => a.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: "Album not found" }, { status: 404 });
    }

    const existing = albums[idx];
    const updated = {
      ...existing,
      ...parsed.data,
      items: parsed.data.items ?? existing.items,
      updatedAt: new Date().toISOString(),
    };

    albums[idx] = updated;
    await writeAlbums(albums);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update album" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const albums = await readAlbums();
    const next = albums.filter((a) => a.id !== params.id);
    if (next.length === albums.length) {
      return NextResponse.json({ success: false, message: "Album not found" }, { status: 404 });
    }
    await writeAlbums(next);
    return NextResponse.json({ success: true, data: { ok: true } });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete album" }, { status: 500 });
  }
}
