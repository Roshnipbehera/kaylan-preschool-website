"use client";
import { motion } from "framer-motion";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { TeachersContent } from "@/lib/types/cms";

const SEED: TeachersContent = {
  heading: "Meet Our Teachers 🌷",
  subtext: "The loving hands that guide every little story forward.",
  teachers: [
    { name: "Ms. Anjali", role: "Lead Montessori Guide", emoji: "👩‍🏫", color: "#FF8FB1" },
    { name: "Mr. Karthik", role: "Music & Movement", emoji: "👨‍🏫", color: "#6EC6FF" },
    { name: "Ms. Divya", role: "Art & Creativity", emoji: "👩‍🎨", color: "#FFD93D" },
    { name: "Ms. Fatima", role: "Kreedo Curriculum Lead", emoji: "👩‍🏫", color: "#7ED957" },
  ],
};

export default function Teachers() {
  const { data } = useCmsSection("teachers", SEED);
  return (
    <section id="teachers" className="relative py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">{data.heading}</h2>
        <p className="text-[#5b4b6b] max-w-xl mx-auto mb-14">{data.subtext}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.teachers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <div className="relative mx-auto w-40 h-40">
                {Array.from({ length: 6 }).map((_, p) => (
                  <motion.div
                    key={p}
                    className="absolute inset-0"
                    style={{ transform: `rotate(${p * 60}deg)` }}
                    animate={{ scale: [0.9, 1, 0.9] }}
                    transition={{ duration: 3, repeat: Infinity, delay: p * 0.15 }}
                  >
                    <div
                      className="w-12 h-16 rounded-full absolute left-1/2 -translate-x-1/2 -top-3 opacity-90 group-hover:opacity-100"
                      style={{ background: t.color }}
                    />
                  </motion.div>
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl shadow-md">
                    <motion.span whileHover={{ rotate: [0, -10, 10, 0] }}>{t.emoji}</motion.span>
                  </div>
                </div>
                <motion.span
                  className="absolute -top-2 -right-2 text-xl opacity-0 group-hover:opacity-100"
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >✨</motion.span>
              </div>
              <h3 className="font-heading font-bold mt-3">{t.name}</h3>
              <p className="text-sm text-[#5b4b6b]">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
