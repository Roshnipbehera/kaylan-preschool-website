"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram, ExternalLink } from "lucide-react";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import { usePublicSettings } from "@/lib/hooks/usePublicSettings";
import type { GalleryContent } from "@/lib/types/cms";

const SEED: GalleryContent = {
  heading: "Gallery of Moments 📸",
  subtext: "Real snapshots of discovery, laughter, creativity and friendship at Kaylan.",
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
    title: "Morning Campus Gate Arrival",
    tag: "Campus Life",
    desc: "Joyful footsteps & warm greetings entering school each morning",
    src: "/images/gallery-outdoor.jpg",
  },
  {
    title: "Koki's Little Yogis",
    tag: "Mindful Movement",
    desc: "Morning stretches, balance exercises & breathing with Mascot Koki",
    src: "/images/gallery-music.jpg",
  },
  {
    title: "Little Veggie Scientists",
    tag: "Experiential Learning",
    desc: "Tactile discovery, texture exploration & botanical curiosity",
    src: "/images/gallery-stem.jpg",
  },
  {
    title: "Fine Motor Skills & Threading",
    tag: "Montessori Skills",
    desc: "Precision dexterity, finger grip & concentration development",
    src: "/images/gallery-reading.jpg",
  },
  {
    title: "Festive Onam Pookalam",
    tag: "Cultural Harmony",
    desc: "Traditional floral rangoli handmade with pride by our students",
    src: "/images/gallery-blocks.jpg",
  },
  {
    title: "Little Tricolour Geniuses",
    tag: "Independence Day",
    desc: "Joyous celebrations, tricolour crafts & national spirit",
    src: "/images/gallery-art.jpg",
  },
];

export default function Gallery() {
  const { data } = useCmsSection("gallery", SEED);
  const { data: settings } = usePublicSettings();
  return (
    <section id="gallery" className="relative py-24 bg-[#EAF8FF]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">{data.heading}</h2>
        <p className="text-[#5b4b6b] max-w-xl mx-auto mb-14">{data.subtext}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOMENTS.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, scale: 0.9, rotate: i % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04, rotate: 0, y: -6 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="bg-white p-3.5 pb-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/80 overflow-hidden text-left"
            >
              <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-gray-100 group">
                <Image
                  src={m.src}
                  alt={m.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-heading font-bold text-candy shadow">
                  {m.tag}
                </span>
              </div>
              <p className="text-sm font-heading font-bold text-[#3a2e4d] mt-3">{m.title}</p>
              <p className="text-xs text-[#5b4b6b] mt-1 leading-snug">{m.desc}</p>
              <p className="text-[10px] text-[#8a7a9a] mt-2 font-mono">Kaylan Verified Moment #{i + 1}</p>
            </motion.div>
          ))}
        </div>

        {/* Official Instagram CTA */}
        {settings.instagramUrl && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 inline-block"
          >
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#d62976] via-[#fa7e1e] to-[#feda75] hover:opacity-95 text-white font-heading font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm"
            >
              <Instagram className="w-5 h-5" />
              <span>Follow @kaylanpreschoolanddaycare on Instagram</span>
              <ExternalLink className="w-4 h-4 ml-1 opacity-90" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
