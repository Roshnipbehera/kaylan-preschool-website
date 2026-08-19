import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { BlogPostForm } from "@/components/blog/BlogPostForm";
import { getPostBySlug } from "@/lib/api/blog";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  // The dynamic segment holds the post's slug (blog posts are slug-keyed,
  // consistent with the public /blog/[slug] route and the blog API).
  let post;
  try {
    post = await getPostBySlug(params.id);
  } catch {
    post = null;
  }
  if (!post) notFound();

  return (
    <DashboardShell>
      <h1 className="font-display text-2xl font-bold text-[#3a2e4d] mb-6">Edit: {post.title}</h1>
      <BlogPostForm existing={post} />
    </DashboardShell>
  );
}
