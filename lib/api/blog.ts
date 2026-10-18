// Live Blog client -- talks to the real Express backend
// (backend/src/controllers/blogController.ts) via lib/api/client.ts's
// apiFetch. If the backend is unreachable or in mock mode, it gracefully
// falls back to the curated blog posts in data/blog/posts.json and
// data/blog/authors.json so SSR pages never hang or fail.
import { apiFetch, USE_MOCK_API } from "@/lib/api/client";
import type { BlogAuthor, BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from "@/lib/types/blog";
import defaultPosts from "@/data/blog/posts.json";
import defaultAuthors from "@/data/blog/authors.json";

export async function listPosts(params?: {
  category?: string;
  search?: string;
  authorId?: string;
  publishedOnly?: boolean;
}): Promise<BlogPost[]> {
  if (USE_MOCK_API) {
    let posts = defaultPosts as unknown as BlogPost[];
    if (params?.category) posts = posts.filter((p) => p.category === params.category);
    if (params?.search) {
      const q = params.search.toLowerCase();
      posts = posts.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    }
    if (params?.authorId) posts = posts.filter((p) => p.authorId === params.authorId);
    return posts;
  }
  try {
    const search = new URLSearchParams();
    if (params?.category) search.set("category", params.category);
    if (params?.search) search.set("search", params.search);
    if (params?.authorId) search.set("authorId", params.authorId);
    if (params?.publishedOnly) search.set("publishedOnly", "true");
    const qs = search.toString();
    const data = await apiFetch<BlogPost[]>(`/blog${qs ? `?${qs}` : ""}`, { cache: "no-store" });
    return data && data.length > 0 ? data : (defaultPosts as unknown as BlogPost[]);
  } catch (err) {
    console.warn("Blog API unavailable, falling back to local posts:", err);
    return defaultPosts as unknown as BlogPost[];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  if (USE_MOCK_API) {
    const post = (defaultPosts as unknown as BlogPost[]).find((p) => p.slug === slug || p.id === slug);
    if (!post) throw new Error("Post not found");
    return post;
  }
  try {
    return await apiFetch<BlogPost>(`/blog/${slug}`, { cache: "no-store" });
  } catch (err) {
    const post = (defaultPosts as unknown as BlogPost[]).find((p) => p.slug === slug || p.id === slug);
    if (post) return post;
    throw err;
  }
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
  if (USE_MOCK_API) {
    const author = (defaultAuthors as unknown as BlogAuthor[]).find((a) => a.slug === authorSlug);
    if (!author) throw new Error("Author not found");
    const posts = (defaultPosts as unknown as BlogPost[]).filter((p) => p.authorId === author.id);
    return { author, posts };
  }
  try {
    return await apiFetch<{ author: BlogAuthor; posts: BlogPost[] }>(`/blog/author/${authorSlug}`, { cache: "no-store" });
  } catch (err) {
    const author = (defaultAuthors as unknown as BlogAuthor[]).find((a) => a.slug === authorSlug);
    if (author) {
      const posts = (defaultPosts as unknown as BlogPost[]).filter((p) => p.authorId === author.id);
      return { author, posts };
    }
    throw err;
  }
}

export async function listAuthors(): Promise<BlogAuthor[]> {
  if (USE_MOCK_API) {
    return defaultAuthors as unknown as BlogAuthor[];
  }
  try {
    const data = await apiFetch<BlogAuthor[]>("/blog/authors", { cache: "no-store" });
    return data && data.length > 0 ? data : (defaultAuthors as unknown as BlogAuthor[]);
  } catch (err) {
    console.warn("Blog authors API unavailable, falling back to local authors:", err);
    return defaultAuthors as unknown as BlogAuthor[];
  }
}
