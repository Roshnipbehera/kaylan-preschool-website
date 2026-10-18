"use client";
import { motion } from "framer-motion";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { AboutContent } from "@/lib/types/cms";

const SEED: AboutContent = {
  heading: "Welcome to",
  highlightWord: "Kaylan Preschool",
  headingEmoji: "📖",
  subtext:
    "Turn the page into a world where every child's story begins with wonder — Montessori-inspired, Kreedo-guided, and full of heart.",
  blocks: [
    { emoji: "🎨", title: "Little Artists", text: "Colours, textures and imagination come alive every day.", bg: "bg-candy/15" },
    { emoji: "📚", title: "Curious Readers", text: "Story time sparks a lifelong love of books and language.", bg: "bg-sky/15" },
    { emoji: "🔢", title: "Number Explorers", text: "Hands-on Maths building through Montessori materials.", bg: "bg-leaf/15" },
    { emoji: "🤝", title: "Confident Friends", text: "Warm, guided social play builds real confidence.", bg: "bg-lavender/20" },
  ],
};

export default function Welcome() {
  const { data } = useCmsSection("about", SEED);
  return (
    <section id="about-us" className="relative py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#3a2e4d]">
            {data.heading} <span className="text-candy">{data.highlightWord}</span> {data.headingEmoji}
          </h2>
          <p className="mt-4 text-[#5b4b6b] max-w-2xl mx-auto">{data.subtext}</p>
        </motion.div>

        {/* Quick Highlights / School Stat Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-14"
        >
          <div className="bg-[#FFFDF5] p-5 rounded-3xl border border-sunshine/30 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-candy">500+</p>
            <p className="text-xs sm:text-sm font-heading font-semibold text-[#5b4b6b] mt-1">Happy Graduates</p>
          </div>
          <div className="bg-[#F0FDF4] p-5 rounded-3xl border border-leaf/30 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-leaf">1:8</p>
            <p className="text-xs sm:text-sm font-heading font-semibold text-[#5b4b6b] mt-1">Teacher-Child Ratio</p>
          </div>
          <div className="bg-[#FAF5FF] p-5 rounded-3xl border border-lavender/40 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-[#7C3AED]">100%</p>
            <p className="text-xs sm:text-sm font-heading font-semibold text-[#5b4b6b] mt-1">Montessori &amp; Kreedo</p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.blocks.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30, rotate: i % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${b.bg} rounded-[2rem] p-7 book-shadow border-2 border-white`}
            >
              <div className="text-5xl mb-4">{b.emoji}</div>
              <h3 className="font-heading text-xl font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-[#5b4b6b]">{b.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Why Electronic City Parents LOVE Kaylan Preschool Section (from official flyer) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-br from-[#FFFDF0] via-[#FAF9FF] to-[#F0FAFF] rounded-[2.5rem] p-8 sm:p-12 border-2 border-sunshine/30 shadow-xl"
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block bg-candy/15 text-candy font-heading font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full mb-3">
              🌱 Seeding Successful Stories
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#3a2e4d]">
              Why Electronic City Parents <span className="text-candy">LOVE</span> Kaylan Preschool? 💖
            </h3>
            <p className="text-sm sm:text-base text-[#5b4b6b] mt-3 leading-relaxed">
              &ldquo;At Kaylan, we don&apos;t just teach... We nurture confidence, curiosity &amp; happiness every single day.&rdquo;
            </p>
          </div>

          {/* 6 Key Pillars from Flyer */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
            {[
              {
                title: "Montessori-Based Learning",
                desc: "Hands-on sensorial apparatus promoting focus, independent choice, and self-directed problem solving.",
                icon: "🧩",
                badge: "Pedagogy",
              },
              {
                title: "Safe, Secure & Hygienic",
                desc: "100% child-safe green campus, continuous CCTV surveillance, trained lady attendants, and sanitized facilities.",
                icon: "🛡️",
                badge: "Safety",
              },
              {
                title: "Daycare for Working Parents",
                desc: "Reliable, warm extended daycare till 6:30 PM with nutritious meal assistance, nap suites, and engaging post-school play.",
                icon: "🎒",
                badge: "Daycare",
              },
              {
                title: "Structured Learning",
                desc: "Conceptual clarity and phonetic discovery — no rote memorization. Aligned with NEP 2020 and Kreedo milestones.",
                icon: "💡",
                badge: "No Rote",
              },
              {
                title: "Hassle-Free Workdays",
                desc: "Complete peace of mind for Electronic City IT professionals. Daily photo updates, safety check-ins, and flexible pickup.",
                icon: "💼",
                badge: "Peace of Mind",
              },
              {
                title: "Emotional Growth & Creativity",
                desc: "Dedicated guidance fostering empathy, social sharing, divergent art exploration, and cheerful communication.",
                icon: "🎨",
                badge: "Creativity",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#3a2e4d] leading-snug">{item.title}</h4>
                    <span className="text-[10px] font-heading font-semibold text-candy uppercase tracking-wider">{item.badge}</span>
                  </div>
                </div>
                <p className="text-xs text-[#5b4b6b] leading-relaxed mt-2">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Child Transformation Journey Strip */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-candy/20 shadow-sm text-center">
            <div className="inline-flex items-center gap-2 bg-leaf/15 text-leaf font-heading font-bold text-xs px-3.5 py-1 rounded-full mb-3">
              <span>🌟 Child Growth Transformation</span>
            </div>
            <h4 className="font-heading font-bold text-lg sm:text-xl text-[#3a2e4d] mb-6">
              Witness Your Child&apos;s Beautiful Transformation at Kaylan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="bg-[#FFF4F7] p-4 rounded-2xl border border-pink-200 text-center">
                <span className="text-3xl block mb-1">🥺 ➔ 💖</span>
                <p className="font-heading font-bold text-xs sm:text-sm text-[#3a2e4d]">From separation anxiety</p>
                <p className="text-xs text-candy font-semibold mt-0.5">to a Happy school-goer</p>
              </div>
              <div className="bg-[#EFF8FF] p-4 rounded-2xl border border-blue-200 text-center">
                <span className="text-3xl block mb-1">😐 ➔ 🗣️</span>
                <p className="font-heading font-bold text-xs sm:text-sm text-[#3a2e4d]">From silent observer</p>
                <p className="text-xs text-sky font-semibold mt-0.5">to Expressive communicator</p>
              </div>
              <div className="bg-[#F2FFF0] p-4 rounded-2xl border border-green-200 text-center">
                <span className="text-3xl block mb-1">🎨 ➔ 💡</span>
                <p className="font-heading font-bold text-xs sm:text-sm text-[#3a2e4d]">From playful curiosity</p>
                <p className="text-xs text-leaf font-semibold mt-0.5">to Creative learner</p>
              </div>
            </div>
            <p className="mt-5 text-xs sm:text-sm font-heading font-bold text-candy inline-block bg-candy/10 px-4 py-1.5 rounded-full">
              ✨ &ldquo;I love my school!&rdquo; — Kaylan Preschool Experience
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
