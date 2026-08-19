import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { logAudit } from "../lib/audit";

// Live Blog CRUD (Batch 3 migration pass). Replaces app/api/blog/**
// (JSON-backed, data/blog/{posts,authors}.json). Response shape mirrors
// lib/types/blog.ts's BlogPost/BlogAuthor exactly. Reads (list/detail/
// by-author/authors) are public (marketing blog is public); create/
// update/delete/publish-toggle require an authenticated admin.

const createPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  body: z.string().min(1),
  coverImageUrl: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  authorId: z.string().min(1),
  published: z.boolean().default(false),
  publishedAt: z.string().optional(),
});
const updatePostSchema = createPostSchema.partial();

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl: string | null;
  category: string;
  tags: string[];
  authorId: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
};

function toPostDto(row: PostRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    coverImageUrl: row.coverImageUrl ?? undefined,
    category: row.category,
    tags: row.tags,
    authorId: row.authorId,
    published: row.published,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : undefined,
  };
}

type AuthorRow = { id: string; slug: string; name: string; bio: string; avatarUrl: string | null };
function toAuthorDto(row: AuthorRow) {
  return { id: row.id, slug: row.slug, name: row.name, bio: row.bio, avatarUrl: row.avatarUrl ?? undefined };
}

export async function listPosts(req: Request, res: Response) {
  const { category, search, authorId, publishedOnly } = req.query as {
    category?: string;
    search?: string;
    authorId?: string;
    publishedOnly?: string;
  };
  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (authorId) where.authorId = authorId;
  if (publishedOnly === "true") where.published = true;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { body: { contains: search, mode: "insensitive" } },
    ];
  }
  const posts = await prisma.blogPost.findMany({ where, orderBy: { createdAt: "desc" } });
  // Public marketing blog list -- no per-user data in the response.
  res.set("Cache-Control", "public, max-age=60");
  res.json({ success: true, data: posts.map((p) => toPostDto(p as PostRow)) });
}

export async function getPostBySlug(req: Request, res: Response) {
  const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
  if (!post) throw new AppError("Post not found", 404);
  res.set("Cache-Control", "public, max-age=60");
  res.json({ success: true, data: toPostDto(post as PostRow) });
}

export async function createPost(req: Request, res: Response) {
  const data = createPostSchema.parse(req.body);
  const post = await prisma.blogPost.create({
    data: {
      ...data,
      publishedAt: data.published ? new Date(data.publishedAt ?? Date.now()) : null,
    },
  });
  await logAudit(req, { action: "blog.create", category: "cms", entity: "BlogPost", entityId: post.id, metadata: { slug: post.slug, title: post.title } });
  res.status(201).json({ success: true, data: toPostDto(post as PostRow) });
}

export async function updatePost(req: Request, res: Response) {
  const data = updatePostSchema.parse(req.body);
  try {
    const existing = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
    if (!existing) throw new AppError("Post not found", 404);
    const willPublish = data.published ?? existing.published;
    const post = await prisma.blogPost.update({
      where: { slug: req.params.slug },
      data: {
        ...data,
        publishedAt: willPublish ? (existing.publishedAt ?? new Date()) : null,
      },
    });
    await logAudit(req, { action: "blog.update", category: "cms", entity: "BlogPost", entityId: post.id, metadata: { slug: post.slug } });
    res.json({ success: true, data: toPostDto(post as PostRow) });
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Post not found", 404);
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const deleted = await prisma.blogPost.delete({ where: { slug: req.params.slug } });
    await logAudit(req, { action: "blog.delete", category: "cms", entity: "BlogPost", entityId: deleted.id, metadata: { slug: deleted.slug } });
    res.json({ success: true, data: { ok: true } });
  } catch {
    throw new AppError("Post not found", 404);
  }
}

export async function listByAuthor(req: Request, res: Response) {
  const author = await prisma.blogAuthor.findUnique({ where: { slug: req.params.authorSlug } });
  if (!author) throw new AppError("Author not found", 404);
  const posts = await prisma.blogPost.findMany({ where: { authorId: author.id }, orderBy: { createdAt: "desc" } });
  res.set("Cache-Control", "public, max-age=60");
  res.json({
    success: true,
    data: { author: toAuthorDto(author as AuthorRow), posts: posts.map((p) => toPostDto(p as PostRow)) },
  });
}

export async function listAuthors(_req: Request, res: Response) {
  const authors = await prisma.blogAuthor.findMany({ orderBy: { name: "asc" } });
  res.set("Cache-Control", "public, max-age=60");
  res.json({ success: true, data: authors.map((a) => toAuthorDto(a as AuthorRow)) });
}
