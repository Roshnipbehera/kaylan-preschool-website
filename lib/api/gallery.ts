// Live Gallery client -- talks to the real Express backend
// (backend/src/controllers/galleryController.ts) via lib/api/client.ts's
// apiFetch. Replaces the previous JSON-mock client that called
// app/api/gallery/**; those route handlers and data/gallery/albums.json
// are left in place untouched but no longer imported by any live UI code.
// Function names/signatures unchanged.
import { apiFetch } from "@/lib/api/client";
import type { CreateGalleryAlbumInput, GalleryAlbum, UpdateGalleryAlbumInput } from "@/lib/types/gallery";

export async function listAlbums(): Promise<GalleryAlbum[]> {
  return apiFetch<GalleryAlbum[]>("/gallery", { cache: "no-store" });
}

export async function getAlbum(id: string): Promise<GalleryAlbum> {
  return apiFetch<GalleryAlbum>(`/gallery/${id}`, { cache: "no-store" });
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
