"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Balloon, Butterfly, Cloud, Rainbow, SunFace, Star } from "./FloatingBackground";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { HomeContent } from "@/lib/types/cms";

const SEED: HomeContent = {
  badge: "🎈 Montessori-inspired · Kreedo Curriculum · Electronic City, Bangalore",
  heading: "Where Little Dreams",
  headingHighlight: "Begin",
  subtext:
    "Learning through Play, Discovery, Creativity and Love — a storybook world built for your child's earliest, happiest years.",
  buttons: [
    { emoji: "🏫", label: "Book a School Tour", href: "#admissions" },
    { emoji: "💬", label: "Enquire Now", href: "#contact" },
    { emoji: "🎒", label: "Apply for Admission", href: "/admissions/apply" },
  ],
};

const BTN_STYLES = [
  "bg-candy text-white shadow-lg shadow-teal-200",
  "bg-sky text-[#3a2e4d] shadow-lg shadow-blue-200",
  "bg-sunshine text-[#4a3b00] shadow-lg shadow-yellow-200",
];

export default function Hero() {
  const { data } = useCmsSection("home", SEED);
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#BEE7FF] via-[#DCF3FF] to-white pt-6 pb-32">
      <SunFace className="top-6 right-8 opacity-90" />
      <Rainbow className="-top-10 left-1/2 -translate-x-1/2 hidden sm:block" />
      <Cloud className="top-20 left-0 opacity-90" delay={0} />
      <Cloud className="top-40 left-0 scale-75 opacity-80" delay={8} />
      <Cloud className="top-10 left-0 scale-125 opacity-70" delay={16} />
      <Balloon color="#FF8FB1" className="top-24 left-[8%]" delay={0} />
      <Balloon color="#FFD93D" className="top-16 right-[10%]" delay={0.6} />
      <Balloon color="#CDB4FF" className="top-48 left-[18%]" delay={1.2} />
      <Butterfly color="#7ED957" className="top-56 right-[20%]" delay={0} />
      <Butterfly color="#FFA552" className="top-72 left-[30%]" delay={2} />
      <Star className="top-28 left-[45%]" delay={0.3} />
      <Star className="top-14 left-[60%]" delay={1} />
      <motion.div
        aria-hidden
        className="absolute top-24 right-[2%] sm:right-[4%] w-20 h-20 sm:w-28 sm:h-28 animate-float pointer-events-none z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Image src="/brand/koki-mascot-final.png" alt="" fill sizes="112px" className="object-contain drop-shadow-lg" priority />
      </motion.div>
      <span aria-hidden className="absolute top-32 right-[6%] text-4xl animate-bob">🪁</span>
      <span aria-hidden className="absolute bottom-40 left-[6%] text-4xl animate-float">🌸</span>
      <span aria-hidden className="absolute bottom-52 right-[14%] text-4xl animate-float">🌼</span>

      <div className="relative max-w-5xl mx-auto px-6 text-center pt-10">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block bg-white/70 backdrop-blur px-4 py-1.5 rounded-full text-sm font-heading font-semibold text-candy mb-6 shadow"
        >
          {data.badge}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, type: "spring" }}
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-[#3a2e4d]"
        >
          {data.heading}
          <span className="block text-candy">{data.headingHighlight}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 text-lg sm:text-xl font-body text-[#5b4b6b] max-w-2xl mx-auto"
        >
          {data.subtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          {data.buttons.map((b, i) => (
            <motion.a
              key={b.label}
              whileHover={{ scale: 1.07, rotate: i % 2 ? 1 : -1 }}
              whileTap={{ scale: 0.94 }}
              href={b.href}
              className={`${BTN_STYLES[i % BTN_STYLES.length]} font-heading font-bold px-7 py-4 rounded-full text-base`}
            >
              {b.emoji} {b.label}
            </motion.a>
          ))}
        </motion.div>

        {/* Illustrated preschool + children scene */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="relative mt-16 mx-auto max-w-3xl"
        >
          <svg viewBox="0 0 600 260" className="w-full h-auto drop-shadow-xl">
            <ellipse cx="300" cy="250" rx="280" ry="16" fill="#7ED957" opacity="0.5" />
            <g>
              <rect x="30" y="150" width="14" height="60" fill="#c98b4a" rx="4" />
              <circle cx="37" cy="140" r="34" fill="#7ED957" />
              <rect x="540" y="150" width="14" height="60" fill="#c98b4a" rx="4" />
              <circle cx="547" cy="140" r="34" fill="#7ED957" />
            </g>
            <g>
              <rect x="190" y="120" width="220" height="100" rx="14" fill="#FFD93D" />
              <polygon points="185,120 415,120 300,60" fill="#FF8FB1" />
              <rect x="270" y="160" width="60" height="60" rx="8" fill="#6EC6FF" />
              <rect x="210" y="150" width="35" height="35" rx="6" fill="white" />
              <rect x="355" y="150" width="35" height="35" rx="6" fill="white" />
              <circle cx="300" cy="55" r="10" fill="#FF8FB1" />
              <rect x="296" y="30" width="8" height="26" fill="#c98b4a" />
            </g>
            <text x="140" y="230" fontSize="34">🧒</text>
            <text x="440" y="230" fontSize="34">👧</text>
            <text x="300" y="235" fontSize="30">🧸</text>
          </svg>
        </motion.div>
      </div>

      <svg aria-hidden className="absolute -bottom-1 left-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,40 C400,110 1040,-10 1440,50 L1440,120 L0,120 Z" fill="white" />
      </svg>
    </section>
  );
}
