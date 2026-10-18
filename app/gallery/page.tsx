import type { Metadata } from "next";
import { Instagram, ExternalLink, Sparkles } from "lucide-react";
import { listAlbums } from "@/lib/api/gallery";
import { GalleryClient } from "@/components/gallery/GalleryClient";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Gallery | Kaylan Preschool & Daycare",
  description:
    "Authentic photos and moments of classroom life, Montessori sensorial exploration, arts & craft, and festival celebrations at Kaylan Preschool Bangalore.",
};

export const dynamic = "force-dynamic";

const GOOGLE_DRIVE_FOLDER_URL =
  "https://drive.google.com/drive/folders/1sB7SKD7pVeWD5IqeaZDpE19opsT9-aqw?usp=sharing";

export default async function GalleryPage() {
  const albums = await listAlbums();

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-[#EAF8FF] via-white to-[#F0FAFF] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
              <a
                href={GOOGLE_DRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-blue-200 text-[#1a73e8] px-4 py-1.5 rounded-full text-xs font-heading font-bold shadow-sm transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 87.3 78" fill="none">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
                <span>Client Photo Album on Google Drive (50+ Photos)</span>
                <ExternalLink size={12} className="opacity-80" />
              </a>

              <a
                href="https://www.instagram.com/kaylanpreschoolanddaycare?stkn=MXR5ZXJmc2c4Z202dw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-amber-500/10 border border-pink-300 text-[#d62976] hover:bg-pink-100/50 px-4 py-1.5 rounded-full text-xs font-heading font-bold shadow-sm transition-all hover:scale-105"
              >
                <Instagram size={14} />
                <span>@kaylanpreschoolanddaycare</span>
                <ExternalLink size={12} className="opacity-80" />
              </a>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 text-[#3a2e4d]">
              Gallery of Moments 📸
            </h1>
            <p className="text-[#5b4b6b] text-sm sm:text-base leading-relaxed">
              Authentic high-resolution snapshots of discovery, circle times, Montessori sensorial lab sessions, and joyful celebrations directly from our Electronic City campus.
            </p>
          </div>
          <GalleryClient albums={albums} />
        </div>
      </main>
      <Footer />
    </>
  );
}
