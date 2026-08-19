import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { logAudit } from "../lib/audit";

// Live Gallery CRUD (Batch 3 migration pass). Replaces app/api/gallery/**
// (JSON-backed, data/gallery/albums.json). Response shape mirrors
// lib/types/gallery.ts's GalleryAlbum (with nested items) exactly. Reads
// are public; create/update/delete of albums+items are admin-only.

const itemSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["image", "video"]),
  url: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  caption: z.string().optional(),
});

const createAlbumSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  coverImage: z.string().min(1),
  description: z.string().optional(),
  items: z.array(itemSchema).default([]),
});
const updateAlbumSchema = createAlbumSchema.partial();

function toAlbumDto(row: {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{ id: string; type: string; url: string; thumbnailUrl: string | null; caption: string | null }>;
}) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    coverImage: row.coverImage,
    description: row.description ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    items: row.items.map((i) => ({
      id: i.id,
      type: i.type,
      url: i.url,
      thumbnailUrl: i.thumbnailUrl ?? undefined,
      caption: i.caption ?? undefined,
    })),
  };
}

export async function listAlbums(_req: Request, res: Response) {
  const albums = await prisma.galleryAlbum.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { orderBy: { order: "asc" } } },
  });
  res.set("Cache-Control", "public, max-age=60");
  res.json({ success: true, data: albums.map(toAlbumDto) });
}

export async function getAlbum(req: Request, res: Response) {
  const album = await prisma.galleryAlbum.findUnique({
    where: { id: req.params.id },
    include: { items: { orderBy: { order: "asc" } } },
  });
  if (!album) throw new AppError("Album not found", 404);
  res.set("Cache-Control", "public, max-age=60");
  res.json({ success: true, data: toAlbumDto(album) });
}

export async function createAlbum(req: Request, res: Response) {
  const data = createAlbumSchema.parse(req.body);
  const album = await prisma.galleryAlbum.create({
    data: {
      title: data.title,
      slug: data.slug,
      coverImage: data.coverImage,
      description: data.description,
      items: {
        create: data.items.map((item, idx) => ({
          type: item.type,
          url: item.url,
          thumbnailUrl: item.thumbnailUrl,
          caption: item.caption,
          order: idx,
        })),
      },
    },
    include: { items: { orderBy: { order: "asc" } } },
  });
  await logAudit(req, { action: "gallery.create", category: "general", entity: "GalleryAlbum", entityId: album.id, metadata: { slug: album.slug, title: album.title } });
  res.status(201).json({ success: true, data: toAlbumDto(album) });
}

export async function updateAlbum(req: Request, res: Response) {
  const data = updateAlbumSchema.parse(req.body);
  const existing = await prisma.galleryAlbum.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Album not found", 404);

  if (data.items) {
    await prisma.galleryItem.deleteMany({ where: { albumId: req.params.id } });
  }

  const album = await prisma.galleryAlbum.update({
    where: { id: req.params.id },
    data: {
      title: data.title,
      slug: data.slug,
      coverImage: data.coverImage,
      description: data.description,
      ...(data.items
        ? {
            items: {
              create: data.items.map((item, idx) => ({
                type: item.type,
                url: item.url,
                thumbnailUrl: item.thumbnailUrl,
                caption: item.caption,
                order: idx,
              })),
            },
          }
        : {}),
    },
    include: { items: { orderBy: { order: "asc" } } },
  });
  await logAudit(req, { action: "gallery.update", category: "general", entity: "GalleryAlbum", entityId: album.id, metadata: { slug: album.slug } });
  res.json({ success: true, data: toAlbumDto(album) });
}

export async function deleteAlbum(req: Request, res: Response) {
  try {
    const deleted = await prisma.galleryAlbum.delete({ where: { id: req.params.id } });
    await logAudit(req, { action: "gallery.delete", category: "general", entity: "GalleryAlbum", entityId: deleted.id, metadata: { slug: deleted.slug } });
    res.json({ success: true, data: { ok: true } });
  } catch {
    throw new AppError("Album not found", 404);
  }
}
