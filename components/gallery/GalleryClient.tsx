"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryAlbum, GalleryItem } from "@/lib/types/gallery";

// Lazy-loaded: only needed once a user opens an image, so it shouldn't be
// part of the initial gallery page bundle.
const Lightbox = dynamic(() => import("@/components/gallery/Lightbox").then((m) => m.Lightbox), { ssr: false });

export function GalleryClient({ albums }: { albums: GalleryAlbum[] }) {
  const [activeAlbumId, setActiveAlbumId] = useState<string>("all");
  const [lightbox, setLightbox] = useState<{ items: GalleryItem[]; index: number } | null>(null);

  const filteredAlbums = useMemo(
    () => (activeAlbumId === "all" ? albums : albums.filter((a) => a.id === activeAlbumId)),
    [albums, activeAlbumId],
  );

  const openLightbox = (album: GalleryAlbum, itemIndex: number) => {
    setLightbox({ items: album.items, index: itemIndex });
  };

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveAlbumId("all")}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-heading font-semibold transition-colors",
            activeAlbumId === "all" ? "bg-candy text-white" : "bg-lavender/10 text-[#3a2e4d] hover:bg-lavender/20",
          )}
        >
          All Albums
        </button>
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => setActiveAlbumId(album.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-heading font-semibold transition-colors",
              activeAlbumId === album.id ? "bg-candy text-white" : "bg-lavender/10 text-[#3a2e4d] hover:bg-lavender/20",
            )}
          >
            {album.title}
          </button>
        ))}
      </div>

      {filteredAlbums.length === 0 ? (
        <p className="py-16 text-center text-[#3a2e4d]/60">No albums to show yet.</p>
      ) : (
        <div className="space-y-16">
          {filteredAlbums.map((album) => (
            <section key={album.id}>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-[#3a2e4d] sm:text-3xl">{album.title}</h2>
                {album.description && <p className="mt-1 max-w-2xl text-sm text-[#5b4b6b]">{album.description}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {album.items.map((item, i) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => openLightbox(album, i)}
                    className="group relative aspect-square overflow-hidden rounded-2xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-candy"
                    aria-label={item.caption ? `Open ${item.caption}` : "Open gallery item"}
                  >
                    <Image
                      src={item.thumbnailUrl ?? item.url}
                      alt={item.caption ?? `${album.title} photo`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <PlayCircle className="text-white drop-shadow-lg" size={40} />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {lightbox && (
        <Lightbox
          items={lightbox.items}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(next) => setLightbox((prev) => (prev ? { ...prev, index: next } : prev))}
        />
      )}
    </div>
  );
}
