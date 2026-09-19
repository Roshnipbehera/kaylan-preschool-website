"use client";
import { motion } from "framer-motion";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { AboutContent } from "@/lib/types/cms";

const SEED: AboutContent = {
  heading: "Welcome to",
  highlightWord: "Kaylan Preschool",
  headingEmoji: "📖",
  subtext:
    "Turn the page into a world where every child's story begins with wonder — Montessori-inspired, Kreedo-guided, and full of heart.",
  blocks: [
    { emoji: "🎨", title: "Little Artists", text: "Colours, textures and imagination come alive every day.", bg: "bg-candy/15" },
    { emoji: "📚", title: "Curious Readers", text: "Story time sparks a lifelong love of books and language.", bg: "bg-sky/15" },
    { emoji: "🔢", title: "Number Explorers", text: "Hands-on Maths building through Montessori materials.", bg: "bg-leaf/15" },
    { emoji: "🤝", title: "Confident Friends", text: "Warm, guided social play builds real confidence.", bg: "bg-lavender/20" },
  ],
};

export default function Welcome() {
  const { data } = useCmsSection("about", SEED);
  return (
    <section id="about-us" className="relative py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#3a2e4d]">
            {data.heading} <span className="text-candy">{data.highlightWord}</span> {data.headingEmoji}
          </h2>
          <p className="mt-4 text-[#5b4b6b] max-w-2xl mx-auto">{data.subtext}</p>
        </motion.div>

        {/* Quick Highlights / School Stat Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-14"
        >
          <div className="bg-[#FFFDF5] p-5 rounded-3xl border border-sunshine/30 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-candy">500+</p>
            <p className="text-xs sm:text-sm font-heading font-semibold text-[#5b4b6b] mt-1">Happy Graduates</p>
          </div>
          <div className="bg-[#F0FDF4] p-5 rounded-3xl border border-leaf/30 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-leaf">1:8</p>
            <p className="text-xs sm:text-sm font-heading font-semibold text-[#5b4b6b] mt-1">Teacher-Child Ratio</p>
          </div>
          <div className="bg-[#EFF6FF] p-5 rounded-3xl border border-sky/30 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-sky">10,000</p>
            <p className="text-xs sm:text-sm font-heading font-semibold text-[#5b4b6b] mt-1">Sq.Ft Green Campus</p>
          </div>
          <div className="bg-[#FAF5FF] p-5 rounded-3xl border border-lavender/40 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-[#7C3AED]">100%</p>
            <p className="text-xs sm:text-sm font-heading font-semibold text-[#5b4b6b] mt-1">Montessori &amp; Kreedo</p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.blocks.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30, rotate: i % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${b.bg} rounded-[2rem] p-7 book-shadow border-2 border-white`}
            >
              <div className="text-5xl mb-4">{b.emoji}</div>
              <h3 className="font-heading text-xl font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-[#5b4b6b]">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
