"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Images } from "lucide-react";
import { listAlbums } from "@/lib/api/gallery";
import { queryKeys } from "@/lib/query/keys";
import { ParentSubNav } from "@/components/parent/ParentSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { GalleryItem } from "@/lib/types/gallery";

const Lightbox = dynamic(() => import("@/components/gallery/Lightbox").then((m) => m.Lightbox), { ssr: false });

export function ParentGalleryContent() {
  const { data: albums, isLoading } = useQuery({ queryKey: queryKeys.galleryAlbums, queryFn: listAlbums });
  const [activeItems, setActiveItems] = useState<GalleryItem[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <ParentSubNav />
      <h1 className="mb-6 font-display text-2xl font-bold text-[#3a2e4d]">School Gallery</h1>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : !albums || albums.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No albums published yet.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {albums.map((album) => (
            <Card key={album.id}>
              <CardHeader className="flex flex-row items-center gap-2">
                <Images size={18} className="text-lavender" />
                <CardTitle>{album.title}</CardTitle>
              </CardHeader>
              {album.description && <p className="mb-4 text-sm text-[#3a2e4d]/60">{album.description}</p>}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {album.items.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveItems(album.items);
                      setActiveIndex(idx);
                    }}
                    className="relative aspect-square overflow-hidden rounded-xl bg-black/5"
                  >
                    <Image
                      src={item.thumbnailUrl ?? item.url}
                      alt={item.caption ?? album.title}
                      fill
                      sizes="200px"
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeItems && (
        <Lightbox
          items={activeItems}
          index={activeIndex}
          onClose={() => setActiveItems(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </div>
  );
}
