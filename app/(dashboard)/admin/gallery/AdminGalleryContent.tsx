"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Plus, Trash2, Upload } from "lucide-react";
import { createAlbum, deleteAlbum, listAlbums, updateAlbum } from "@/lib/api/gallery";
import { uploadGalleryImage } from "@/lib/api/upload";
import { createGalleryAlbumSchema, type CreateGalleryAlbumFormValues } from "@/lib/validation/gallery";
import { queryKeys } from "@/lib/query/keys";
import { useToast } from "@/lib/hooks/useToast";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Skeleton } from "@/components/ui/Skeleton";
import type { GalleryAlbum, GalleryItem } from "@/lib/types/gallery";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function genId() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}-${Math.random()}`;
}

function NewAlbumForm({ onCreated }: { onCreated: () => void }) {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateGalleryAlbumFormValues>({
    resolver: zodResolver(createGalleryAlbumSchema),
    defaultValues: { title: "", slug: "", coverImage: "", description: "", items: [] },
  });

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title);
    if (!slugTouched) setValue("slug", slugify(title));
  };

  const onSubmit = async (values: CreateGalleryAlbumFormValues) => {
    setSubmitting(true);
    try {
      await createAlbum(values);
      toast.success("Album created.");
      reset({ title: "", slug: "", coverImage: "", description: "", items: [] });
      setSlugTouched(false);
      onCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create album");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <h2 className="mb-4 font-heading text-lg font-semibold text-[#3a2e4d]">Create New Album</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
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
          <Input label="Cover Image URL" {...register("coverImage")} error={errors.coverImage?.message} />
        </FormField>
        <FormField>
          <Input label="Description" {...register("description")} error={errors.description?.message} />
        </FormField>
        <div className="sm:col-span-2 flex justify-end">
          <Button type="submit" isLoading={submitting}>
            <Plus size={16} className="mr-1" /> Create Album
          </Button>
        </div>
      </form>
    </Card>
  );
}

function AddItemForm({ album, onSaved }: { album: GalleryAlbum; onSaved: (items: GalleryItem[]) => void }) {
  const toast = useToast();
  const [type, setType] = useState<"image" | "video">("image");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const { url: uploadedUrl } = await uploadGalleryImage(file);
      setUrl(uploadedUrl);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!url.trim()) {
      toast.error("Provide an image/video URL or upload a file first.");
      return;
    }
    setSubmitting(true);
    try {
      const newItem: GalleryItem = { id: genId(), type, url: url.trim(), caption: caption.trim() || undefined };
      const items = [...album.items, newItem];
      await updateAlbum(album.id, { items });
      onSaved(items);
      setUrl("");
      setCaption("");
      toast.success("Item added.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border-2 border-dashed border-lavender/40 p-4">
      <p className="mb-3 font-heading text-sm font-semibold text-[#3a2e4d]">Add Item</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "image" | "video")}
            className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
        <Input label="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <div className="sm:col-span-2">
          <Input label="URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        </div>
        {type === "image" && (
          <div className="sm:col-span-2">
            <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Or upload a file</label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-lavender/40 px-4 py-2.5 text-sm">
              <Upload size={16} />
              {uploading ? "Uploading..." : "Choose file"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
              />
            </label>
          </div>
        )}
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="button" size="sm" onClick={submit} isLoading={submitting}>
          <Plus size={16} className="mr-1" /> Add to Album
        </Button>
      </div>
    </div>
  );
}

function AlbumPanel({ album, onChanged }: { album: GalleryAlbum; onChanged: () => void }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(album.items);
  const [busy, setBusy] = useState(false);

  const persistItems = async (next: GalleryItem[]) => {
    setBusy(true);
    try {
      await updateAlbum(album.id, { items: next });
      setItems(next);
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update album");
    } finally {
      setBusy(false);
    }
  };

  const removeItem = (id: string) => {
    if (!confirm("Remove this item from the album?")) return;
    persistItems(items.filter((i) => i.id !== id));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    persistItems(next);
  };

  const removeAlbum = async () => {
    if (!confirm(`Delete the "${album.title}" album? This cannot be undone.`)) return;
    try {
      await deleteAlbum(album.id);
      toast.success("Album deleted.");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete album");
    }
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-heading font-semibold">{album.title}</p>
          <p className="text-xs text-[#3a2e4d]/60">
            /{album.slug} · {items.length} item{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="sky">{album.items.filter((i) => i.type === "video").length} videos</Badge>
          <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />} Manage
          </Button>
          <Button variant="danger" size="sm" onClick={removeAlbum}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {open && (
        <div className="mt-4 border-t border-black/5 pt-4">
          {items.length === 0 ? (
            <p className="text-sm text-[#3a2e4d]/60">No items yet. Add one below.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-lavender/5 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#3a2e4d]">
                      {item.type === "video" ? "🎬" : "🖼️"} {item.caption ?? item.url}
                    </p>
                    <p className="truncate text-xs text-[#3a2e4d]/50">{item.url}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" disabled={busy || i === 0} onClick={() => move(i, -1)}>
                      <ChevronUp size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" disabled={busy || i === items.length - 1} onClick={() => move(i, 1)}>
                      <ChevronDown size={14} />
                    </Button>
                    <Button variant="danger" size="sm" disabled={busy} onClick={() => removeItem(item.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <AddItemForm album={{ ...album, items }} onSaved={(next) => setItems(next)} />
        </div>
      )}
    </Card>
  );
}

export function AdminGalleryContent() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: queryKeys.galleryAlbums, queryFn: listAlbums });

  const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.galleryAlbums });

  const albums = useMemo(() => data ?? [], [data]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Gallery Albums</h1>
      </div>

      <NewAlbumForm onCreated={refresh} />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No albums yet. Create your first album above.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {albums.map((album) => (
            <AlbumPanel key={album.id} album={album} onChanged={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}
