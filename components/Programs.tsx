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
    { name: "Playgroup", age: "1.5 - 2.5 yrs", color: "#FF8FB1", roof: "#FFD93D" },
    { name: "Nursery", age: "2.5 - 3.5 yrs", color: "#6EC6FF", roof: "#FFA552" },
    { name: "Junior KG", age: "3.5 - 4.5 yrs", color: "#7ED957", roof: "#FF8FB1" },
    { name: "Senior KG", age: "4.5 - 5.5 yrs", color: "#CDB4FF", roof: "#6EC6FF" },
  ],
};

const PROGRAM_DETAILS: Record<string, { desc: string; focus: string[]; timing: string }> = {
  Playgroup: {
    desc: "A gentle, joyful first step into social learning and sensory discovery.",
    focus: ["Sensory & tactile play", "Motor skill development", "Social circle & songs"],
    timing: "8:30 AM – 12:00 PM",
  },
  Nursery: {
    desc: "Building confidence, curious vocabulary, and early mathematical concepts.",
    focus: ["Phonics & language joy", "Kreedo math materials", "Creative art & music"],
    timing: "8:30 AM – 12:30 PM",
  },
  "Junior KG": {
    desc: "Nurturing independent thinking, early reading, and scientific curiosity.",
    focus: ["Guided reading & writing", "Logic & number skills", "Nature & STEM wonder"],
    timing: "8:30 AM – 1:00 PM",
  },
  "Senior KG": {
    desc: "Comprehensive readiness for primary school with strong foundational mastery.",
    focus: ["Advanced phonics & math", "Creative expression & drama", "Confident presentation"],
    timing: "8:30 AM – 1:30 PM",
  },
};

function House({ h, i }: { h: ProgramHouse; i: number }) {
  const [open, setOpen] = useState(false);
  const details = PROGRAM_DETAILS[h.name] ?? {
    desc: "Montessori-inspired holistic early education.",
    focus: ["Child-centric learning", "Play & discovery"],
    timing: "8:30 AM – 12:30 PM",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      className="relative flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-[2.5rem] p-6 shadow-xl hover:shadow-2xl border-2 border-white transition-all duration-300 w-full max-w-[280px] text-center"
    >
      <div className="relative mb-3">
        <svg width="130" height="120" viewBox="0 0 150 140" className="drop-shadow-md">
          <motion.polygon
            points="10,65 75,15 140,65"
            fill={h.roof}
            animate={{ y: open ? -6 : 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
          <rect x="25" y="65" width="100" height="65" rx="10" fill={h.color} />
          <motion.rect
            x="62"
            y={open ? "80" : "95"}
            width="26"
            height="35"
            rx="4"
            fill="#4a3b1a"
            animate={{ height: open ? 48 : 35, y: open ? 80 : 95 }}
          />
          <circle cx="45" cy="90" r="8" fill="white" opacity="0.9" />
          <circle cx="105" cy="90" r="8" fill="white" opacity="0.9" />
        </svg>
      </div>

      <span className="inline-block px-3 py-1 rounded-full text-xs font-heading font-semibold bg-[#FFFDF5] text-candy border border-candy/20 mb-2">
        Age: {h.age}
      </span>

      <h3 className="font-heading text-xl font-bold text-[#3a2e4d]">{h.name}</h3>
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
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">{data.heading}</h2>
        <p className="text-[#5b4b6b] max-w-xl mx-auto mb-14">{data.subtext}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 place-items-center">
          {data.houses.map((h, i) => <House key={h.name} h={h} i={i} />)}
        </div>
      </div>
    </section>
  );
}
