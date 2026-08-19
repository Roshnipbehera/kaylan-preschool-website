"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";
import { cn } from "@/lib/utils";
import type { BlogAuthor, BlogPost } from "@/lib/types/blog";

export function BlogListClient({ posts, authors }: { posts: BlogPost[]; authors: BlogAuthor[] }) {
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => ["all", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);
  const authorById = useMemo(() => new Map(authors.map((a) => [a.id, a])), [authors]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const categoryMatch = category === "all" || p.category === category;
      if (!categoryMatch) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, category, query]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-heading font-semibold transition-colors",
                category === c ? "bg-candy text-white" : "bg-lavender/10 text-[#3a2e4d] hover:bg-lavender/20",
              )}
            >
              {c === "all" ? "All Posts" : c}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3a2e4d]/40" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full rounded-2xl border-2 border-lavender/40 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-candy focus:outline-none focus:ring-2 focus:ring-candy"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-[#3a2e4d]/60 py-16">No posts match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} author={authorById.get(post.authorId)} />
          ))}
        </div>
      )}
    </div>
  );
}
