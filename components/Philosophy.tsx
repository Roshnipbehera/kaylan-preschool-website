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

const PILLAR_DETAILS: Record<string, { desc: string; outcome: string; bgGradient: string }> = {
  "Play-based Learning": {
    desc: "Unstructured and guided play that sparks curiosity, problem-solving, and natural joyful discovery.",
    outcome: "Cognitive Agility & Joy",
    bgGradient: "from-[#FFF0F5] to-white",
  },
  "Montessori-inspired": {
    desc: "Self-directed activity with authentic wooden sensorial apparatus promoting deep focus and independence.",
    outcome: "Focus & Self-Reliance",
    bgGradient: "from-[#F0F8FF] to-white",
  },
  "Kreedo Curriculum": {
    desc: "Scientifically structured early language, phonics, mathematics, and cognitive milestones aligned with NEP 2020.",
    outcome: "Phonics & Early Math",
    bgGradient: "from-[#FFF9E6] to-white",
  },
  "Creative Thinking": {
    desc: "Daily sensory art, pottery, drama, and storytelling designed to nurture imagination without right or wrong answers.",
    outcome: "Divergent Innovation",
    bgGradient: "from-[#F5F0FF] to-white",
  },
  "Confidence Building": {
    desc: "Show-and-tell circles, stage performances, and empathetic guidance that foster emotional resilience.",
    outcome: "Public Speaking & Empathy",
    bgGradient: "from-[#FFFDF0] to-white",
  },
  "Hands-on Activities": {
    desc: "Tactile gardening, sand & water tables, baking, and basic science experiments for all five senses.",
    outcome: "Fine Motor & Discovery",
    bgGradient: "from-[#F2FFF0] to-white",
  },
};

export default function Philosophy() {
  const { data } = useCmsSection("curriculum", SEED);
  return (
    <section id="curriculum" className="relative py-24 bg-[#FCFBF7]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <span className="inline-block bg-sunshine/30 text-[#6a5400] font-heading font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full mb-3">
          Pedagogical Excellence
        </span>
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4 text-[#3a2e4d]">{data.heading}</h2>
        <p className="text-[#5b4b6b] max-w-2xl mx-auto mb-16 text-base sm:text-lg">
          We combine Dr. Maria Montessori&apos;s hands-on philosophy with the accredited Kreedo early learning framework, nurturing curious, confident, and joyful lifelong learners.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {data.pillars.map((p, i) => {
            const detail = PILLAR_DETAILS[p.title] ?? {
              desc: "Holistic early childhood development focusing on natural curiosity and joy.",
              outcome: "Growth & Joy",
              bgGradient: "from-white to-white",
            };
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-3xl p-7 border-2 border-white shadow-lg bg-gradient-to-b ${detail.bgGradient} flex flex-col justify-between transition-shadow hover:shadow-xl`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-white"
                      style={{ backgroundColor: `${p.color}33` }}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                    >
                      {p.emoji}
                    </motion.div>
                    <span
                      className="text-[11px] font-heading font-bold px-3 py-1 rounded-full border text-[#4a3b00]"
                      style={{ backgroundColor: `${p.color}25`, borderColor: `${p.color}66` }}
                    >
                      {detail.outcome}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#3a2e4d] mb-2">{p.title}</h3>
                  <p className="text-sm text-[#5b4b6b] leading-relaxed">{detail.desc}</p>
                </div>
                <div className="mt-5 pt-4 border-t border-black/5 flex items-center gap-2 text-xs font-heading font-semibold text-[#8a7a9a]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>Research-backed framework</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
