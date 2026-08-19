// Live Blog client -- talks to the real Express backend
// (backend/src/controllers/blogController.ts) via lib/api/client.ts's
// apiFetch. Replaces the previous JSON-mock client that called
// app/api/blog/**; those route handlers and data/blog/*.json are left in
// place untouched but no longer imported by any live UI code. Function
// names/signatures unchanged so every consuming page needs zero changes.
import { apiFetch } from "@/lib/api/client";
import type { BlogAuthor, BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from "@/lib/types/blog";

export async function listPosts(params?: {
  category?: string;
  search?: string;
  authorId?: string;
  publishedOnly?: boolean;
}): Promise<BlogPost[]> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.search) search.set("search", params.search);
  if (params?.authorId) search.set("authorId", params.authorId);
  if (params?.publishedOnly) search.set("publishedOnly", "true");
  const qs = search.toString();
  return apiFetch<BlogPost[]>(`/blog${qs ? `?${qs}` : ""}`, { cache: "no-store" });
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  return apiFetch<BlogPost>(`/blog/${slug}`, { cache: "no-store" });
}

export async function createPost(input: CreateBlogPostInput): Promise<BlogPost> {
  return apiFetch<BlogPost>("/blog", { method: "POST", json: input });
}

export async function updatePost(slug: string, input: UpdateBlogPostInput): Promise<BlogPost> {
  return apiFetch<BlogPost>(`/blog/${slug}`, { method: "PATCH", json: input });
}

export async function deletePost(slug: string): Promise<void> {
  await apiFetch<{ ok: true }>(`/blog/${slug}`, { method: "DELETE" });
}

export async function listByAuthor(authorSlug: string): Promise<{ author: BlogAuthor; posts: BlogPost[] }> {
  return apiFetch<{ author: BlogAuthor; posts: BlogPost[] }>(`/blog/author/${authorSlug}`, { cache: "no-store" });
}

export async function listAuthors(): Promise<BlogAuthor[]> {
  return apiFetch<BlogAuthor[]>("/blog/authors", { cache: "no-store" });
}
