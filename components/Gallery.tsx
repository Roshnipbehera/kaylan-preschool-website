"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Instagram, ExternalLink, FolderHeart, Sparkles } from "lucide-react";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import { usePublicSettings } from "@/lib/hooks/usePublicSettings";
import type { GalleryContent } from "@/lib/types/cms";

const SEED: GalleryContent = {
  heading: "Gallery of Moments 📸",
  subtext: "Real snapshots of discovery, circle time, creative art, and celebrations at Kaylan.",
  frames: [
    { shape: "cloud", color: "#6EC6FF", emoji: "🎨" },
    { shape: "star", color: "#FFD93D", emoji: "🎵" },
    { shape: "rainbow", color: "#FF8FB1", emoji: "🧩" },
    { shape: "polaroid", color: "#7ED957", emoji: "🌳" },
    { shape: "cloud", color: "#CDB4FF", emoji: "📖" },
    { shape: "star", color: "#FFA552", emoji: "🔬" },
  ],
};

const MOMENTS = [
  {
    title: "Morning Circle Time & Rhymes",
    tag: "Circle Time",
    desc: "Interactive storytelling, rhymes and joyful group learning under our rainbow mural",
    src: "/images/client/L00-K-31.jpg",
  },
  {
    title: "Montessori Sensorial Lab",
    tag: "Montessori Lab",
    desc: "Accessible wooden shelving equipped with authentic Montessori sensorial apparatus",
    src: "/images/client/L00-K-17.jpg",
  },
  {
    title: "Hands-on Anatomy & Puzzles",
    tag: "Experiential Learning",
    desc: "Tactile discovery, shape sorting cylinders & cognitive puzzle exploration",
    src: "/images/client/L00-K-35.jpg",
  },
  {
    title: "Creative Arts & Pastels",
    tag: "Creative Arts",
    desc: "Coloring studio developing tripod grasp and imaginative toddler expression",
    src: "/images/client/L00-K-43.jpg",
  },
  {
    title: "Campus Front & Entrance Ramp",
    tag: "Campus Life",
    desc: "Colorful 2-story independent building with rainbow facade, Buddha mosaic & safety gate",
    src: "/images/client/L00-K-1.jpg",
  },
  {
    title: "Festive Celebration & Dance",
    tag: "Celebrations",
    desc: "Joyous music, cultural dance, and traditional attire on our indoor green activity turf",
    src: "/images/client/L00-K-46.jpg",
  },
];

export default function Gallery() {
  const { data } = useCmsSection("gallery", SEED);
  const { data: settings } = usePublicSettings();

  return (
    <section id="gallery" className="relative py-24 bg-[#EAF8FF] overflow-hidden">
      {/* Decorative Floating Dots / Blobs */}
      <div className="absolute top-12 left-10 w-24 h-24 rounded-full bg-candy/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-16 right-10 w-36 h-36 rounded-full bg-sunshine/20 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-1.5 rounded-full text-xs font-heading font-semibold text-candy shadow-sm mb-4 border border-candy/15">
            <Sparkles size={14} />
            Authentic Photo Gallery · Kaylan Preschool
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3 text-[#3a2e4d]">
            {data.heading}
          </h2>
          <p className="text-[#5b4b6b] max-w-xl mx-auto mb-14 text-sm sm:text-base">
            {data.subtext}
          </p>
        </motion.div>

        {/* Gallery Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOMENTS.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              whileHover={{ scale: 1.04, y: -8, rotate: i % 2 === 0 ? 0.8 : -0.8 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5, type: "spring", stiffness: 120 }}
              className="bg-white p-3.5 pb-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/90 overflow-hidden text-left group"
            >
              <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={m.src}
                  alt={m.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-heading font-bold text-candy shadow-md">
                  {m.tag}
                </span>
              </div>
              <p className="text-sm font-heading font-bold text-[#3a2e4d] mt-3 group-hover:text-candy transition-colors">
                {m.title}
              </p>
              <p className="text-xs text-[#5b4b6b] mt-1 leading-snug">{m.desc}</p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 text-[11px] text-[#8a7a9a]">
                <span className="font-heading font-semibold text-[#5b4b6b]">✨ Campus Activity</span>
                <span className="font-heading font-semibold text-candy">Electronic City Campus</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action CTAs: Full Albums & Instagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Dedicated Gallery Page Link */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2.5 bg-candy hover:bg-candy/90 text-white font-heading font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-candy/30 transition-all text-sm"
            >
              <FolderHeart className="w-4 h-4" />
              <span>Explore All 50+ Campus Photos</span>
            </Link>
          </motion.div>

          {/* Official Instagram CTA */}
          {settings.instagramUrl && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#d62976] via-[#fa7e1e] to-[#feda75] hover:opacity-95 text-white font-heading font-bold px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all text-sm"
            >
              <Instagram className="w-4 h-4" />
              <span>@kaylanpreschoolanddaycare</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
            </motion.a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
