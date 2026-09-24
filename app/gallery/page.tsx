import type { Metadata } from "next";
import { Instagram, ExternalLink } from "lucide-react";
import { listAlbums } from "@/lib/api/gallery";
import { GalleryClient } from "@/components/gallery/GalleryClient";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Gallery | Kaylan Preschool",
  description: "Photos and videos of classroom life, sports day, art & craft, and festival celebrations at Kaylan Preschool.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const albums = await listAlbums();

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-[#EAF8FF] to-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <a
              href="https://www.instagram.com/kaylanpreschoolanddaycare?stkn=MXR5ZXJmc2c4Z202dw=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-amber-500/10 border border-pink-300 text-[#d62976] hover:bg-pink-100/50 px-4 py-1.5 rounded-full text-xs font-heading font-bold mb-4 shadow-sm transition-all"
            >
              <Instagram size={14} />
              <span>@kaylanpreschoolanddaycare</span>
              <ExternalLink size={12} className="opacity-80" />
            </a>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 text-[#3a2e4d]">
              Gallery of Moments 📸
            </h1>
            <p className="text-[#5b4b6b] text-sm sm:text-base leading-relaxed">
              Authentic snapshots and highlights of joy, curiosity, festivals and friendship directly from our campus life.
            </p>
          </div>
          <GalleryClient albums={albums} />
        </div>
      </main>
      <Footer />
    </>
  );
}
