"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deletePost, listPosts, updatePost } from "@/lib/api/blog";
import { queryKeys } from "@/lib/query/keys";
import { useToast } from "@/lib/hooks/useToast";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export function AdminBlogContent() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.blogPosts,
    queryFn: () => listPosts(),
  });

  const togglePublish = async (slug: string, published: boolean) => {
    try {
      await updatePost(slug, { published: !published });
      qc.invalidateQueries({ queryKey: queryKeys.blogPosts });
      toast.success(!published ? "Post published." : "Post moved to draft.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update post");
    }
  };

  const remove = async (slug: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      await deletePost(slug);
      qc.invalidateQueries({ queryKey: queryKeys.blogPosts });
      toast.success("Post deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Blog Posts</h1>
        <Link href="/admin/blog/new">
          <Button>
            <Plus size={16} className="mr-1" /> New Post
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No posts yet. Create your first post.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.map((post) => (
            <Card key={post.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-heading font-semibold">{post.title}</p>
                <p className="text-xs text-[#3a2e4d]/60">
                  {post.category} · /{post.slug} · Updated {new Date(post.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={post.published ? "leaf" : "sunshine"}>{post.published ? "Published" : "Draft"}</Badge>
                <Button variant="outline" size="sm" onClick={() => togglePublish(post.slug, post.published)}>
                  {post.published ? "Unpublish" : "Publish"}
                </Button>
                <Link href={`/admin/blog/${post.slug}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil size={16} />
                  </Button>
                </Link>
                <Button variant="danger" size="sm" onClick={() => remove(post.slug)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
