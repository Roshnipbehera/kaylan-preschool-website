"use client";
import { motion } from "framer-motion";

const ISLANDS = [
  {
    name: "Art Island",
    emoji: "🎨",
    color: "#FF8FB1",
    desc: "Finger painting, clay sculpting, and vibrant collage art.",
    skills: "Fine Motor & Creativity",
  },
  {
    name: "Story Forest",
    emoji: "📖",
    color: "#7ED957",
    desc: "Interactive puppet shows, picture books, and vocabulary quests.",
    skills: "Phonics & Expression",
  },
  {
    name: "Music Mountain",
    emoji: "🎵",
    color: "#6EC6FF",
    desc: "Orff rhythm instruments, musical scales, and creative dance.",
    skills: "Auditory & Rhythm",
  },
  {
    name: "Puzzle Valley",
    emoji: "🧩",
    color: "#CDB4FF",
    desc: "Kreedo tactile math materials, spatial mazes, and logic building.",
    skills: "Math & Problem Solving",
  },
  {
    name: "Science Garden",
    emoji: "🔬",
    color: "#FFA552",
    desc: "Planting seeds, magnifying light tables, and insect discovery.",
    skills: "Sensory & STEM",
  },
  {
    name: "Outdoor Adventure Park",
    emoji: "🌳",
    color: "#FFD93D",
    desc: "Wooden climbing structures, balancing tracks, and turf sports.",
    skills: "Gross Motor & Teamwork",
  },
];

export default function Adventures() {
  return (
    <section id="curriculum" className="relative py-24 bg-[#EAF8FF] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center relative">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">Today&apos;s Adventures 🗺️</h2>
        <p className="text-[#5b4b6b] max-w-xl mx-auto mb-14">
          Six magical islands of discovery — every day is a new expedition.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ISLANDS.map((isl, i) => (
            <motion.div
              key={isl.name}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10, scale: 1.04 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring" }}
              className="relative rounded-[2.5rem] p-8 text-white overflow-hidden shadow-xl"
              style={{ background: `linear-gradient(160deg, ${isl.color}, ${isl.color}cc)` }}
            >
              <svg className="absolute -bottom-4 left-0 w-full opacity-30" viewBox="0 0 200 40">
                <ellipse cx="100" cy="20" rx="100" ry="20" fill="white" />
              </svg>
              <div className="flex items-center justify-between mb-3">
                <span className="text-5xl">{isl.emoji}</span>
                <span className="bg-white/25 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-heading font-bold text-white tracking-wide">
                  {isl.skills}
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold text-left">{isl.name}</h3>
              <p className="text-xs text-white/90 text-left mt-2 leading-relaxed">
                {isl.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
