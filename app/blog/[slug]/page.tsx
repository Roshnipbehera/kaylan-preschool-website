import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listAuthors, listPosts } from "@/lib/api/blog";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { PostCard } from "@/components/blog/PostCard";
import { Badge } from "@/components/ui/Badge";
import { blogPostingStructuredData } from "@/lib/seo/structuredData";

export const dynamic = "force-dynamic";

async function getData(slug: string) {
  const [posts, authors] = await Promise.all([listPosts({ publishedOnly: true }), listAuthors()]);
  const post = posts.find((p) => p.slug === slug);
  return { post, posts, authors };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { post } = await getData(params.slug);
  if (!post) return { title: "Post Not Found | Kaylan Preschool" };

  return {
    title: `${post.title} | Kaylan Preschool Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { post, posts, authors } = await getData(params.slug);
  if (!post) notFound();

  const author = authors.find((a) => a.id === post.authorId);
  const related = posts
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.published &&
        (p.category === post.category || p.tags.some((t) => post.tags.includes(t))),
    )
    .slice(0, 3);

  const structuredData = blogPostingStructuredData({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    coverImageUrl: post.coverImageUrl,
    publishedAt: post.publishedAt,
    authorName: author?.name,
  });

  return (
    <main id="main-content" className="min-h-screen bg-white py-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="max-w-3xl mx-auto px-6">
        <Badge tone="lavender" className="mb-4">
          {post.category}
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3a2e4d] mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-[#3a2e4d]/60 mb-6">
          {author && (
            <Link href={`/blog/author/${author.slug}`} className="font-semibold text-candy hover:underline">
              {author.name}
            </Link>
          )}
          <span>·</span>
          <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}</span>
        </div>

        {post.coverImageUrl && (
          <div className="relative mb-8 h-64 sm:h-96 w-full overflow-hidden rounded-3xl">
            <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" sizes="100vw" priority />
          </div>
        )}

        <MarkdownRenderer content={post.body} />

        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} tone="sky">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mt-16">
          <h2 className="font-display text-2xl font-bold text-[#3a2e4d] mb-6 text-center">Related Posts</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} author={authors.find((a) => a.id === p.authorId)} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
