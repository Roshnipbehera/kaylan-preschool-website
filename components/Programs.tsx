"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { ProgramsContent, ProgramHouse } from "@/lib/types/cms";

const SEED: ProgramsContent = {
  heading: "Our Little Houses 🏡",
  subtext: "Each program is a cosy house on our storybook street — hover or tap to peek inside!",
  houses: [
    { name: "Playgroup (L0)", age: "2 – 3 yrs", color: "#FF8FB1", roof: "#FFD93D" },
    { name: "Nursery (L1)", age: "3 – 4 yrs", color: "#6EC6FF", roof: "#FFA552" },
    { name: "Junior KG (L3)", age: "4 – 5 yrs", color: "#7ED957", roof: "#FF8FB1" },
    { name: "Senior KG (L4)", age: "5 – 6 yrs", color: "#CDB4FF", roof: "#6EC6FF" },
    { name: "Daycare & After-School", age: "1 – 10 yrs", color: "#FFA552", roof: "#7ED957" },
  ],
};

const PROGRAM_DETAILS: Record<string, { desc: string; focus: string[]; timing: string; peekEmoji: string }> = {
  "Playgroup (L0)": {
    desc: "A gentle, joyful first step into social learning, sensory discovery, and motor coordination.",
    focus: ["Sensory & tactile play", "Fine & gross motor skills", "Circle time & rhymes"],
    timing: "8:30 AM – 12:00 PM",
    peekEmoji: "🐥",
  },
  "Nursery (L1)": {
    desc: "Building confidence, curious vocabulary, early phonics, and foundational math concepts.",
    focus: ["Jolly Phonics sounds", "Kreedo math materials", "Storytelling & puppet joy"],
    timing: "8:30 AM – 12:30 PM",
    peekEmoji: "🌱",
  },
  "Junior KG (L3)": {
    desc: "Nurturing independent thinking, structured writing grip, early reading, and scientific curiosity.",
    focus: ["Guided phonetic reading", "Math beads & logic", "Nature & mini-STEM experiments"],
    timing: "8:30 AM – 1:00 PM",
    peekEmoji: "🚀",
  },
  "Senior KG (L4)": {
    desc: "Comprehensive Grade 1 primary school readiness with advanced phonics and mental math.",
    focus: ["Reading & comprehension", "Mental math & place value", "Public speaking & presentation"],
    timing: "8:30 AM – 1:30 PM",
    peekEmoji: "🎓",
  },
  "Daycare & After-School": {
    desc: "Loving, secure extended care and engaging after-school hobby clubs for working parents.",
    focus: ["Individual rest & nap pods", "Homework guidance & reading", "Sports & creative hobby clubs"],
    timing: "8:30 AM – 6:30 PM",
    peekEmoji: "🧸",
  },
};

function House({ h, i }: { h: ProgramHouse; i: number }) {
  const [open, setOpen] = useState(false);
  const matchedKey = Object.keys(PROGRAM_DETAILS).find((k) =>
    h.name.toLowerCase().includes(k.split(" ")[0].toLowerCase())
  );
  const details = (matchedKey ? PROGRAM_DETAILS[matchedKey] : PROGRAM_DETAILS[h.name]) ?? {
    desc: "Montessori-inspired holistic early education.",
    focus: ["Child-centric learning", "Play & discovery"],
    timing: "8:30 AM – 12:30 PM",
    peekEmoji: "⭐",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ delay: i * 0.1, type: "spring", stiffness: 150 }}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      className="relative flex flex-col items-center bg-white/95 backdrop-blur-sm rounded-[2.5rem] p-6 shadow-xl hover:shadow-2xl border-2 border-white transition-all duration-300 w-full max-w-[280px] text-center"
    >
      <div className="relative mb-3">
        {/* Floating Chimney Smoke Puff on hover */}
        <motion.span
          animate={{
            opacity: open ? [0, 0.8, 0] : 0,
            y: open ? [-2, -18] : 0,
            scale: open ? [0.6, 1.2] : 0.6,
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          className="absolute -top-3 right-6 text-xs pointer-events-none"
        >
          💨
        </motion.span>

        <svg width="130" height="120" viewBox="0 0 150 140" className="drop-shadow-md">
          {/* Chimney */}
          <rect x="105" y="25" width="16" height="25" rx="3" fill="#8D6E63" />

          {/* House Roof with Spring Bounce */}
          <motion.polygon
            points="10,65 75,15 140,65"
            fill={h.roof}
            animate={{ y: open ? -8 : 0, scale: open ? 1.02 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />

          {/* House Base Body */}
          <rect x="25" y="65" width="100" height="65" rx="10" fill={h.color} />

          {/* Doorway Background */}
          <rect x="62" y="80" width="26" height="50" rx="4" fill="#3D2B1F" />

          {/* Door Sliding / Opening Animation */}
          <motion.rect
            x="62"
            y={open ? "80" : "95"}
            width="26"
            height="35"
            rx="4"
            fill="#5D4037"
            animate={{
              height: open ? 48 : 35,
              y: open ? 80 : 95,
              opacity: open ? 0.3 : 1,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Peek-in Character when Door opens */}
          {open && (
            <text x="75" y="112" textAnchor="middle" fontSize="16">
              {details.peekEmoji}
            </text>
          )}

          {/* Windows with Warm Glow on hover */}
          <motion.circle
            cx="45"
            cy="90"
            r="9"
            fill={open ? "#FFF9C4" : "white"}
            stroke={open ? "#FFD54F" : "#ECEFF1"}
            strokeWidth="1.5"
            animate={{ scale: open ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.circle
            cx="105"
            cy="90"
            r="9"
            fill={open ? "#FFF9C4" : "white"}
            stroke={open ? "#FFD54F" : "#ECEFF1"}
            strokeWidth="1.5"
            animate={{ scale: open ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>
      </div>

      <span className="inline-block px-3 py-1 rounded-full text-xs font-heading font-semibold bg-[#FFFDF5] text-candy border border-candy/20 mb-2">
        Age: {h.age}
      </span>

      <h3 className="font-heading text-lg font-bold text-[#3a2e4d]">{h.name}</h3>
      <p className="text-xs text-[#5b4b6b] mt-2 mb-4 leading-relaxed min-h-[36px]">
        {details.desc}
      </p>

      <ul className="text-left w-full space-y-1.5 mb-5 text-[11px] text-[#4a3b1a] bg-[#FAF8F5] p-3 rounded-2xl">
        {details.focus.map((f) => (
          <li key={f} className="flex items-center gap-1.5">
            <span className="text-leaf font-bold">✓</span> {f}
          </li>
        ))}
      </ul>

      <div className="w-full pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
        <span className="text-[#8a7a9a] font-medium">🕒 {details.timing}</span>
        <a
          href="#contact"
          className="text-candy font-heading font-bold hover:underline"
        >
          Enquire →
        </a>
      </div>
    </motion.div>
  );
}

export default function Programs() {
  const { data } = useCmsSection("programs", SEED);
  return (
    <section id="programs" className="relative py-24 bg-gradient-to-b from-white to-[#FFF6E0]">
      <div aria-hidden className="absolute top-6 left-4 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 animate-floatSlow pointer-events-none">
        <Image src="/brand/koki-mascot-final.png" alt="" fill sizes="80px" className="object-contain drop-shadow-md" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">{data.heading}</h2>
        <p className="text-[#5b4b6b] max-w-xl mx-auto mb-14">{data.subtext}</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 place-items-center">
          {data.houses.map((h, i) => <House key={h.name} h={h} i={i} />)}
        </div>
      </div>
    </section>
  );
}
