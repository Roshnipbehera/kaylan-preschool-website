"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { AdmissionsStepsContent } from "@/lib/types/cms";

const SEED: AdmissionsStepsContent = {
  heading: "Admissions — Stepping Stones 🪨",
  subtext: "Five simple steps to joining the Kaylan family.",
  steps: [
    { label: "Visit School", emoji: "🏫" },
    { label: "Meet Teachers", emoji: "👩‍🏫" },
    { label: "Campus Tour", emoji: "🚶" },
    { label: "Admission", emoji: "📝" },
    { label: "Welcome Kit", emoji: "🎁" },
  ],
  ctaLabel: "🎉 Start Your Journey Today",
  ctaHref: "/admissions/apply",
};

const STEP_DETAILS: Record<string, string> = {
  "Visit School": "Schedule a relaxed morning visit",
  "Meet Teachers": "One-on-one guide conversation",
  "Campus Tour": "Explore classrooms & play garden",
  Admission: "Submit quick form & documents",
  "Welcome Kit": "Receive school bag & kit",
};

export default function Admissions() {
  const { data } = useCmsSection("admissions-steps", SEED);
  return (
    <section id="admissions" className="relative py-24 bg-gradient-to-b from-[#EAF8FF] to-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">{data.heading}</h2>
        <p className="text-[#5b4b6b] max-w-xl mx-auto mb-16">{data.subtext}</p>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4">
          {data.steps.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring" }}
              className="flex flex-col md:flex-row items-center gap-3"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 rounded-full bg-leaf/20 border-4 border-leaf flex items-center justify-center text-3xl shadow-md"
                >
                  {s.emoji}
                </motion.div>
                <p className="font-heading font-bold mt-3 text-base text-[#3a2e4d]">Step {i + 1}</p>
                <p className="font-heading font-semibold text-xs text-candy mt-0.5">{s.label}</p>
                <p className="text-[11px] text-[#5b4b6b] mt-1 max-w-[130px] leading-tight">
                  {STEP_DETAILS[s.label] ?? "Easy and transparent process"}
                </p>
              </div>
              {i < data.steps.length - 1 && (
                <span className="hidden md:block text-2xl text-leaf/60 font-bold px-1">→</span>
              )}
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col items-center mt-14 gap-2">
          <motion.div
            aria-hidden
            className="w-16 h-16 sm:w-20 sm:h-20 animate-bob pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Image src="/brand/koki-mascot-final.png" alt="Koki the Kaylan mascot cheering you on" width={80} height={92} className="object-contain" />
          </motion.div>
          <motion.a
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            href={data.ctaHref}
            className="inline-block bg-candy text-white font-heading font-bold px-8 py-4 rounded-full shadow-lg"
          >
            {data.ctaLabel}
          </motion.a>
        </div>
      </div>
    </section>
  );
}
