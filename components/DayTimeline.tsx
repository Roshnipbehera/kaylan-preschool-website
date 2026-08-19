"use client";
import { motion } from "framer-motion";

const DAY = [
  { time: "8:30 AM", label: "Morning Welcome", emoji: "🌅" },
  { time: "9:00 AM", label: "Circle Time", emoji: "🧑‍🤝‍🧑" },
  { time: "9:30 AM", label: "Music", emoji: "🎵" },
  { time: "10:00 AM", label: "Art", emoji: "🎨" },
  { time: "10:45 AM", label: "Snack Time", emoji: "🍎" },
  { time: "11:15 AM", label: "Outdoor Play", emoji: "⚽" },
  { time: "12:00 PM", label: "Story Time", emoji: "📖" },
  { time: "12:30 PM", label: "Nap Time", emoji: "😴" },
  { time: "2:30 PM", label: "Home Time", emoji: "🏡" },
];

export default function DayTimeline() {
  return (
    <section id="facilities" className="relative py-24 bg-gradient-to-b from-[#FFF6E0] to-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">A Day at Kaylan ⏰</h2>
        <p className="text-[#5b4b6b] max-w-xl mx-auto mb-14">A gentle rhythm of play, learning, rest and joy.</p>
      </div>
      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-sunshine/40 hidden md:block" />
        <div className="space-y-8">
          {DAY.map((d, i) => (
            <motion.div
              key={d.label}
              initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 md:w-1/2 ${i % 2 ? "md:ml-auto md:flex-row-reverse md:text-right" : ""}`}
            >
              <div className="w-14 h-14 shrink-0 rounded-full bg-white shadow-md flex items-center justify-center text-2xl border-2 border-sunshine">
                {d.emoji}
              </div>
              <div>
                <p className="text-xs text-[#8a7a9a] font-semibold">{d.time}</p>
                <p className="font-heading font-bold">{d.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
