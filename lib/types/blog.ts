// TypeScript interfaces for the Blog system. Mirrors the JSON persisted
// under data/blog/posts.json and the shape returned by app/api/blog/**
// route handlers.

export interface BlogAuthor {
  id: string;
  slug: string;
  name: string;
  bio: string;
  avatarUrl?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string; // markdown
  coverImageUrl?: string;
  category: string;
  tags: string[];
  authorId: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export type CreateBlogPostInput = Omit<BlogPost, "id" | "createdAt" | "updatedAt">;
export type UpdateBlogPostInput = Partial<CreateBlogPostInput>;
