import type { Metadata } from "next";
import { listAuthors, listPosts } from "@/lib/api/blog";
import { BlogListClient } from "@/components/blog/BlogListClient";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog | Kaylan Preschool",
  description: "Parenting tips, curriculum deep-dives, and early childhood development insights from the Kaylan Preschool team.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [allPosts, authors] = await Promise.all([listPosts({ publishedOnly: true }), listAuthors()]);
  const posts = allPosts.sort((a, b) => ((a.publishedAt ?? a.createdAt) < (b.publishedAt ?? b.createdAt) ? 1 : -1));

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-[#FFF6EF] to-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-center mb-3 text-[#3a2e4d]">
            The Kaylan Blog 📚
          </h1>
          <p className="text-center text-[#5b4b6b] mb-10 max-w-2xl mx-auto">
            Tips, curriculum insights, and stories from our classrooms -- straight from our educators to you.
          </p>
          <BlogListClient posts={posts} authors={authors} />
        </div>
      </main>
      <Footer />
    </>
  );
}
