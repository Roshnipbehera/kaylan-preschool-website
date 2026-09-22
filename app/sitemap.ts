import type { MetadataRoute } from "next";
import { listPosts, listAuthors } from "@/lib/api/blog";
import { listEvents } from "@/lib/api/events";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kaylan-preschool-website.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/programs`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/curriculum`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/facilities`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/careers`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/gallery`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/events`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/admissions/apply`, changeFrequency: "monthly", priority: 0.9 },
  ];

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await listPosts({ publishedOnly: true });
    postRoutes = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    postRoutes = [];
  }

  let authorRoutes: MetadataRoute.Sitemap = [];
  try {
    const authors = await listAuthors();
    authorRoutes = authors.map((a) => ({
      url: `${SITE_URL}/blog/author/${a.slug}`,
      changeFrequency: "monthly",
      priority: 0.4,
    }));
  } catch {
    authorRoutes = [];
  }

  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    const events = await listEvents();
    eventRoutes = events.map((e) => ({
      url: `${SITE_URL}/events#${e.id}`,
      lastModified: e.updatedAt,
      changeFrequency: "weekly",
      priority: 0.5,
    }));
  } catch {
    eventRoutes = [];
  }

  return [...staticRoutes, ...postRoutes, ...authorRoutes, ...eventRoutes];
}
