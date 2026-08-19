import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { BlogAuthor, BlogPost } from "@/lib/types/blog";

export function PostCard({ post, author }: { post: BlogPost; author?: BlogAuthor }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden bg-lavender/10">
        {post.coverImageUrl && (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Badge tone="lavender" className="mb-2 w-fit">
          {post.category}
        </Badge>
        <h3 className="font-heading text-lg font-bold text-[#3a2e4d] mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-sm text-[#5b4b6b]/80 line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-[#3a2e4d]/60">
          <span>{author?.name ?? "Kaylan Preschool"}</span>
          <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}</span>
        </div>
      </div>
    </Link>
  );
}
