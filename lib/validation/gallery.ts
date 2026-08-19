import { z } from "zod";

export const galleryItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["image", "video"]),
  url: z.string().min(1, "URL is required"),
  thumbnailUrl: z.string().optional(),
  caption: z.string().optional(),
});

export const createGalleryAlbumSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, hyphen-separated"),
  coverImage: z.string().min(1, "Cover image is required"),
  description: z.string().optional().default(""),
  items: z.array(galleryItemSchema).default([]),
});

export const updateGalleryAlbumSchema = createGalleryAlbumSchema.partial();

export type CreateGalleryAlbumFormValues = z.infer<typeof createGalleryAlbumSchema>;
export type GalleryItemFormValues = z.infer<typeof galleryItemSchema>;
