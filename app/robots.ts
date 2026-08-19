import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kaylanpreschool.example";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/parent", "/teacher", "/admin", "/profile", "/settings", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
