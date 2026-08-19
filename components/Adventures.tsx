"use client";
import { motion } from "framer-motion";

const ISLANDS = [
  { name: "Art Island", emoji: "🎨", color: "#FF8FB1" },
  { name: "Story Forest", emoji: "📖", color: "#7ED957" },
  { name: "Music Mountain", emoji: "🎵", color: "#6EC6FF" },
  { name: "Puzzle Valley", emoji: "🧩", color: "#CDB4FF" },
  { name: "Science Garden", emoji: "🔬", color: "#FFA552" },
  { name: "Outdoor Adventure Park", emoji: "🌳", color: "#FFD93D" },
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
              <div className="text-5xl mb-3">{isl.emoji}</div>
              <h3 className="font-heading text-xl font-bold">{isl.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
