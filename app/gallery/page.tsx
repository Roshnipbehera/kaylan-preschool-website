import type { Metadata } from "next";
import { listAlbums } from "@/lib/api/gallery";
import { GalleryClient } from "@/components/gallery/GalleryClient";

export const metadata: Metadata = {
  title: "Gallery | Kaylan Preschool",
  description: "Photos and videos of classroom life, sports day, art & craft, and festival celebrations at Kaylan Preschool.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const albums = await listAlbums();

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-b from-[#EAF8FF] to-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-center mb-3 text-[#3a2e4d]">
          Gallery of Moments 📸
        </h1>
        <p className="text-center text-[#5b4b6b] mb-10 max-w-2xl mx-auto">
          Snapshots and highlight reels of joy, curiosity, and friendship from around our campus.
        </p>
        <GalleryClient albums={albums} />
      </div>
    </main>
  );
}
