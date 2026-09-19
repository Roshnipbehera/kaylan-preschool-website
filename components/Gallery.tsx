"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
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
    title: "Outdoor Garden Play & Adventure",
    tag: "Gross Motor & Sports",
    src: "/images/gallery-outdoor.jpg",
  },
  {
    title: "Creative Painting & Expression",
    tag: "Fine Motor & Arts",
    src: "/images/gallery-art.jpg",
  },
  {
    title: "Music, Rhythm & Circle Time",
    tag: "Social & Musical",
    src: "/images/gallery-music.jpg",
  },
  {
    title: "Sensory STEM & Nature Discovery",
    tag: "Montessori Science",
    src: "/images/gallery-stem.jpg",
  },
  {
    title: "Storybook Reading & Cozy Nook",
    tag: "Language & Phonics",
    src: "/images/gallery-reading.jpg",
  },
  {
    title: "Architectural Wooden Block Play",
    tag: "Spatial Reasoning",
    src: "/images/gallery-blocks.jpg",
  },
];

export default function Gallery() {
  const { data } = useCmsSection("gallery", SEED);
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
              <p className="text-[11px] text-[#8a7a9a] mt-0.5">Kaylan Campus Moment #{i + 1}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
