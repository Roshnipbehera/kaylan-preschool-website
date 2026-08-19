"use client";
import { motion } from "framer-motion";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { CurriculumContent } from "@/lib/types/cms";

const SEED: CurriculumContent = {
  heading: "Our Learning Philosophy 💫",
  subtext: "Six friendly characters guide the Kaylan way of learning.",
  pillars: [
    { title: "Play-based Learning", emoji: "🧸", color: "#FF8FB1" },
    { title: "Montessori-inspired", emoji: "🧩", color: "#6EC6FF" },
    { title: "Kreedo Curriculum", emoji: "📘", color: "#FFA552" },
    { title: "Creative Thinking", emoji: "💡", color: "#CDB4FF" },
    { title: "Confidence Building", emoji: "🌟", color: "#FFD93D" },
    { title: "Hands-on Activities", emoji: "✋", color: "#7ED957" },
  ],
};

export default function Philosophy() {
  const { data } = useCmsSection("curriculum", SEED);
  return (
    <section id="philosophy" className="relative py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">{data.heading}</h2>
        <p className="text-[#5b4b6b] max-w-xl mx-auto mb-14">{data.subtext}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-[2rem] p-7 border-2 border-white book-shadow"
              style={{ backgroundColor: `${p.color}22` }}
            >
              <motion.div
                className="text-5xl mb-3 inline-block"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
              >
                {p.emoji}
              </motion.div>
              <h3 className="font-heading text-lg font-bold">{p.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
