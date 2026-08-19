"use client";
import { motion } from "framer-motion";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { GalleryContent } from "@/lib/types/cms";

const SEED: GalleryContent = {
  heading: "Gallery of Moments 📸",
  subtext: "Snapshots of joy, curiosity and friendship.",
  frames: [
    { shape: "cloud", color: "#6EC6FF", emoji: "🎨" },
    { shape: "star", color: "#FFD93D", emoji: "🎵" },
    { shape: "rainbow", color: "#FF8FB1", emoji: "🧩" },
    { shape: "polaroid", color: "#7ED957", emoji: "🌳" },
    { shape: "cloud", color: "#CDB4FF", emoji: "📖" },
    { shape: "star", color: "#FFA552", emoji: "🔬" },
  ],
};

export default function Gallery() {
  const { data } = useCmsSection("gallery", SEED);
  return (
    <section id="gallery" className="relative py-24 bg-[#EAF8FF]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">{data.heading}</h2>
        <p className="text-[#5b4b6b] max-w-xl mx-auto mb-14">{data.subtext}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.frames.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.85, rotate: i % 2 ? 4 : -4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.06, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white p-3 pb-8 rounded-2xl shadow-lg"
            >
              <div
                className="h-40 rounded-xl flex items-center justify-center text-5xl"
                style={{ background: `linear-gradient(160deg, ${f.color}55, ${f.color}22)` }}
              >
                {f.emoji}
              </div>
              <p className="text-xs text-[#8a7a9a] mt-2 font-heading">Kaylan Moments #{i + 1}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
