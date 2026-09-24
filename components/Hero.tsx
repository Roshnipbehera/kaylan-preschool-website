"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Balloon, Butterfly, Cloud, Rainbow, SunFace, Star } from "./FloatingBackground";
import BookTourModal from "./BookTourModal";
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
  const [tourModalOpen, setTourModalOpen] = useState(false);

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#BEE7FF] via-[#DCF3FF] to-white pt-6 pb-32">
      <BookTourModal isOpen={tourModalOpen} onClose={() => setTourModalOpen(false)} />
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
          {data.buttons.map((b, i) => {
            const isTourBtn = b.label.toLowerCase().includes("tour");
            if (isTourBtn) {
              return (
                <motion.button
                  key={b.label}
                  type="button"
                  onClick={() => setTourModalOpen(true)}
                  whileHover={{ scale: 1.07, rotate: i % 2 ? 1 : -1 }}
                  whileTap={{ scale: 0.94 }}
                  className={`${BTN_STYLES[i % BTN_STYLES.length]} font-heading font-bold px-7 py-4 rounded-full text-base cursor-pointer`}
                >
                  {b.emoji} {b.label}
                </motion.button>
              );
            }
            return (
              <motion.a
                key={b.label}
                whileHover={{ scale: 1.07, rotate: i % 2 ? 1 : -1 }}
                whileTap={{ scale: 0.94 }}
                href={b.href}
                className={`${BTN_STYLES[i % BTN_STYLES.length]} font-heading font-bold px-7 py-4 rounded-full text-base`}
              >
                {b.emoji} {b.label}
              </motion.a>
            );
          })}
        </motion.div>

        {/* Visual Showcase: Real Classroom Photography with Floating Stat Badges */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative mt-16 mx-auto max-w-4xl"
        >
          <div className="relative rounded-[2.5rem] p-3 sm:p-4 bg-white/60 backdrop-blur-md shadow-2xl border-4 border-white/80 overflow-hidden">
            <div className="relative h-[280px] sm:h-[420px] md:h-[480px] w-full rounded-[2rem] overflow-hidden">
              <Image
                src="/images/hero-montessori.jpg"
                alt="Happy children learning with Montessori materials at Kaylan Preschool Bangalore"
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Glassmorphic Trust Badges */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 left-8 sm:left-10 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white/60 flex items-center gap-2.5 text-left hidden sm:flex"
            >
              <span className="text-xl">⭐</span>
              <div>
                <p className="text-xs font-heading font-bold text-[#3a2e4d]">Rated 4.9 / 5</p>
                <p className="text-[10px] text-[#5b4b6b]">350+ Electronic City Parents</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-8 left-8 sm:left-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white/60 flex items-center gap-2.5 text-left"
            >
              <div className="w-9 h-9 rounded-full bg-candy/15 flex items-center justify-center text-candy font-bold text-sm">
                1:8
              </div>
              <div>
                <p className="text-xs font-heading font-bold text-[#3a2e4d]">Montessori Guided</p>
                <p className="text-[10px] text-[#5b4b6b]">Dedicated Individual Attention</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-8 right-8 sm:right-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white/60 flex items-center gap-2.5 text-left hidden sm:flex"
            >
              <span className="text-xl">🛡️</span>
              <div>
                <p className="text-xs font-heading font-bold text-[#3a2e4d]">Safe Green Campus</p>
                <p className="text-[10px] text-[#5b4b6b]">CCTV Monitored · Daycare till 6:30 PM</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <svg aria-hidden className="absolute -bottom-1 left-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,40 C400,110 1040,-10 1440,50 L1440,120 L0,120 Z" fill="white" />
      </svg>
    </section>
  );
}
