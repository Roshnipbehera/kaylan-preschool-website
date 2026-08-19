import { z } from "zod";

export const createBlogPostSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, hyphen-separated"),
  title: z.string().min(3, "Title is required"),
  excerpt: z.string().min(3, "Excerpt is required"),
  body: z.string().min(10, "Body content is required"),
  coverImageUrl: z.string().optional().default(""),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  authorId: z.string().min(1, "Author is required"),
  published: z.boolean().default(false),
  publishedAt: z.string().optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export type CreateBlogPostFormValues = z.infer<typeof createBlogPostSchema>;
