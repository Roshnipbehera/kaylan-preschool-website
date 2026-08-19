// TypeScript interfaces for the Gallery system. Mirrors the JSON persisted
// under data/gallery/albums.json and the shape returned by app/api/gallery/**
// route handlers.

export type GalleryItemType = "image" | "video";

export interface GalleryItem {
  id: string;
  type: GalleryItemType;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  description?: string;
  items: GalleryItem[];
  createdAt: string;
  updatedAt: string;
}

export type CreateGalleryAlbumInput = Omit<GalleryAlbum, "id" | "createdAt" | "updatedAt">;
export type UpdateGalleryAlbumInput = Partial<CreateGalleryAlbumInput>;
