import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { listByAuthor } from "@/lib/api/blog";
import { PostCard } from "@/components/blog/PostCard";

export const dynamic = "force-dynamic";

async function getData(authorSlug: string) {
  let data: Awaited<ReturnType<typeof listByAuthor>>;
  try {
    data = await listByAuthor(authorSlug);
  } catch {
    return null;
  }
  const authorPosts = data.posts
    .filter((p) => p.published)
    .sort((a, b) => ((a.publishedAt ?? a.createdAt) < (b.publishedAt ?? b.createdAt) ? 1 : -1));
  return { author: data.author, posts: authorPosts };
}

export async function generateMetadata({ params }: { params: { authorSlug: string } }): Promise<Metadata> {
  const data = await getData(params.authorSlug);
  if (!data) return { title: "Author Not Found | Kaylan Preschool" };
  return {
    title: `${data.author.name} | Kaylan Preschool Blog`,
    description: data.author.bio,
  };
}

export default async function AuthorPage({ params }: { params: { authorSlug: string } }) {
  const data = await getData(params.authorSlug);
  if (!data) notFound();
  const { author, posts } = data;

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-b from-[#F1FBFF] to-white py-16">
      <div className="max-w-4xl mx-auto px-6 text-center mb-12">
        {author.avatarUrl && (
          <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md">
            <Image src={author.avatarUrl} alt={author.name} fill className="object-cover" sizes="96px" />
          </div>
        )}
        <h1 className="font-display text-3xl font-bold text-[#3a2e4d] mb-2">{author.name}</h1>
        <p className="text-[#5b4b6b] max-w-xl mx-auto">{author.bio}</p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {posts.length === 0 ? (
          <p className="text-center text-[#3a2e4d]/60">No published posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} author={author} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
