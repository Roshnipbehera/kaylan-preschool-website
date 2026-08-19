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

function House({ h, i }: { h: ProgramHouse; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.button
      onClick={() => setOpen(!open)}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      className="relative flex flex-col items-center focus:outline-none"
      aria-expanded={open}
    >
      <svg width="150" height="150" viewBox="0 0 150 150">
        <motion.polygon
          points="10,70 75,20 140,70"
          fill={h.roof}
          animate={{ y: open ? -8 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        />
        <rect x="25" y="70" width="100" height="65" rx="10" fill={h.color} />
        <motion.rect
          x="62" y={open ? "85" : "100"} width="26" height="35" rx="4" fill="#4a3b1a"
          animate={{ height: open ? 50 : 35, y: open ? 85 : 100 }}
        />
        <circle cx="45" cy="95" r="8" fill="white" opacity="0.9" />
        <circle cx="105" cy="95" r="8" fill="white" opacity="0.9" />
      </svg>
      <h3 className="font-heading text-lg font-bold mt-2">{h.name}</h3>
      <motion.p
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden text-sm text-[#5b4b6b]"
      >
        {h.age}
      </motion.p>
    </motion.button>
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
