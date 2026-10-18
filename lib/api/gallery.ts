// Live Gallery client -- talks to the real Express backend
// (backend/src/controllers/galleryController.ts) via lib/api/client.ts's
// apiFetch. If the backend is unreachable or in mock mode, it gracefully
// falls back to the curated albums in data/gallery/albums.json so pages
// never hang or fail during SSR.
import { apiFetch, USE_MOCK_API } from "@/lib/api/client";
import type { CreateGalleryAlbumInput, GalleryAlbum, UpdateGalleryAlbumInput } from "@/lib/types/gallery";
import defaultAlbums from "@/data/gallery/albums.json";

export async function listAlbums(): Promise<GalleryAlbum[]> {
  if (USE_MOCK_API) {
    return defaultAlbums as unknown as GalleryAlbum[];
  }
  try {
    const data = await apiFetch<GalleryAlbum[]>("/gallery", { cache: "no-store" });
    return data && data.length > 0 ? data : (defaultAlbums as unknown as GalleryAlbum[]);
  } catch (err) {
    console.warn("Gallery API unavailable, falling back to local albums:", err);
    return defaultAlbums as unknown as GalleryAlbum[];
  }
}

export async function getAlbum(id: string): Promise<GalleryAlbum> {
  if (USE_MOCK_API) {
    const album = (defaultAlbums as unknown as GalleryAlbum[]).find((a) => a.id === id || a.slug === id);
    if (!album) throw new Error("Album not found");
    return album;
  }
  try {
    return await apiFetch<GalleryAlbum>(`/gallery/${id}`, { cache: "no-store" });
  } catch (err) {
    const album = (defaultAlbums as unknown as GalleryAlbum[]).find((a) => a.id === id || a.slug === id);
    if (album) return album;
    throw err;
  }
}

export async function createAlbum(input: CreateGalleryAlbumInput): Promise<GalleryAlbum> {
  return apiFetch<GalleryAlbum>("/gallery", { method: "POST", json: input });
}

export async function updateAlbum(id: string, input: UpdateGalleryAlbumInput): Promise<GalleryAlbum> {
  return apiFetch<GalleryAlbum>(`/gallery/${id}`, { method: "PATCH", json: input });
}

export async function deleteAlbum(id: string): Promise<void> {
  await apiFetch<{ ok: true }>(`/gallery/${id}`, { method: "DELETE" });
}
