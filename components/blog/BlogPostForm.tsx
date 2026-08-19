"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createBlogPostSchema, type CreateBlogPostFormValues } from "@/lib/validation/blog";
import { createPost, listAuthors, updatePost } from "@/lib/api/blog";
import { useToast } from "@/lib/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import type { BlogPost } from "@/lib/types/blog";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BlogPostForm({ existing }: { existing?: BlogPost }) {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [slugTouched, setSlugTouched] = useState(!!existing);

  const { data: authors } = useQuery({ queryKey: ["blog-authors"], queryFn: listAuthors });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateBlogPostFormValues>({
    resolver: zodResolver(createBlogPostSchema),
    defaultValues: existing
      ? {
          slug: existing.slug,
          title: existing.title,
          excerpt: existing.excerpt,
          body: existing.body,
          coverImageUrl: existing.coverImageUrl ?? "",
          category: existing.category,
          tags: existing.tags,
          authorId: existing.authorId,
          published: existing.published,
        }
      : {
          slug: "",
          title: "",
          excerpt: "",
          body: "",
          coverImageUrl: "",
          category: "",
          tags: [],
          authorId: "",
          published: false,
        },
  });

  const body = watch("body");
  const tagsValue = watch("tags");
  const tagsText = useMemo(() => (tagsValue ?? []).join(", "), [tagsValue]);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title);
    if (!slugTouched) setValue("slug", slugify(title));
  };

  const onSubmit = async (values: CreateBlogPostFormValues) => {
    setSubmitting(true);
    try {
      if (existing) {
        await updatePost(existing.slug, values);
        toast.success("Post updated.");
      } else {
        await createPost(values);
        toast.success("Post created.");
      }
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <FormField>
          <Input label="Title" {...register("title")} onChange={onTitleChange} error={errors.title?.message} />
        </FormField>
        <FormField>
          <Input
            label="Slug"
            {...register("slug")}
            onChange={(e) => {
              setSlugTouched(true);
              register("slug").onChange(e);
            }}
            error={errors.slug?.message}
          />
        </FormField>
        <FormField>
          <Input label="Excerpt" {...register("excerpt")} error={errors.excerpt?.message} />
        </FormField>
        <FormField>
          <Input label="Cover Image URL" {...register("coverImageUrl")} error={errors.coverImageUrl?.message} />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField>
            <Input label="Category" {...register("category")} error={errors.category?.message} />
          </FormField>
          <FormField>
            <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Author</label>
            <select
              {...register("authorId")}
              className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5"
            >
              <option value="">Select author...</option>
              {authors?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            {errors.authorId && <p className="mt-1 text-xs font-semibold text-red-500">{errors.authorId.message}</p>}
          </FormField>
        </div>
        <FormField>
          <Input
            label="Tags (comma-separated)"
            defaultValue={tagsText}
            onChange={(e) =>
              setValue(
                "tags",
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              )
            }
          />
        </FormField>
        <FormField>
          <label className="flex items-center gap-2 font-heading text-sm font-semibold text-[#3a2e4d]">
            <input type="checkbox" {...register("published")} className="h-4 w-4" />
            Published
          </label>
        </FormField>
      </Card>

      <Card>
        <div className="mb-3 flex gap-2">
          <Button type="button" variant={tab === "write" ? "primary" : "outline"} size="sm" onClick={() => setTab("write")}>
            Write
          </Button>
          <Button type="button" variant={tab === "preview" ? "primary" : "outline"} size="sm" onClick={() => setTab("preview")}>
            Preview
          </Button>
        </div>
        {tab === "write" ? (
          <div>
            <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Body (Markdown)</label>
            <textarea
              {...register("body")}
              rows={16}
              className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 font-mono text-sm focus:border-candy focus:outline-none focus:ring-2 focus:ring-candy"
            />
            {errors.body && <p className="mt-1 text-xs font-semibold text-red-500">{errors.body.message}</p>}
          </div>
        ) : (
          <div className="max-h-[28rem] overflow-y-auto rounded-2xl border-2 border-lavender/20 p-4">
            <MarkdownRenderer content={body || "*Nothing to preview yet.*"} />
          </div>
        )}
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" isLoading={submitting}>
          {existing ? "Save Changes" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
