import { DashboardShell } from "@/components/layout/DashboardShell";
import { BlogPostForm } from "@/components/blog/BlogPostForm";

export const metadata = {
  title: "New Post | Kaylan Preschool Admin",
};

export default function NewBlogPostPage() {
  return (
    <DashboardShell>
      <h1 className="font-display text-2xl font-bold text-[#3a2e4d] mb-6">New Blog Post</h1>
      <BlogPostForm />
    </DashboardShell>
  );
}
