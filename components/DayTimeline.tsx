"use client";
import { motion } from "framer-motion";

interface DayScheduleItem {
  time: string;
  label: string;
  emoji: string;
  desc: string;
  tag: string;
  tagColor: string;
}

const DAY: DayScheduleItem[] = [
  {
    time: "8:30 AM",
    label: "Warm Morning Welcome",
    emoji: "🌅",
    desc: "Personal temperature check, shoe-rack independence, and warm teacher greetings with smiles.",
    tag: "Transition & Independence",
    tagColor: "bg-[#FFF0F5] text-candy",
  },
  {
    time: "9:00 AM",
    label: "Morning Circle & Songs",
    emoji: "🧑‍🤝‍🧑",
    desc: "Good-morning action songs, calendar & weather discovery, emotions check-in, and theme of the day.",
    tag: "Social Bonding",
    tagColor: "bg-[#EBF7FF] text-[#006699]",
  },
  {
    time: "9:30 AM",
    label: "Montessori Work Period",
    emoji: "🧩",
    desc: "Uninterrupted hands-on exploration with cylinder blocks, pink tower, sandpaper letters, and bead stairs.",
    tag: "Deep Concentration",
    tagColor: "bg-[#F3E8FF] text-[#6B21A8]",
  },
  {
    time: "10:30 AM",
    label: "Nutritious Snack & Table Grace",
    emoji: "🍎",
    desc: "Fresh seasonal fruits, whole grains, and guided table manners with independent handwashing routines.",
    tag: "Healthy Habits",
    tagColor: "bg-[#F0FFF4] text-[#15803D]",
  },
  {
    time: "11:00 AM",
    label: "Garden & Outdoor Adventures",
    emoji: "🌳",
    desc: "Sandpit play, splash water games, balance beams, tricycle tracks, and tactile nature observation.",
    tag: "Gross Motor Skills",
    tagColor: "bg-[#FFFBEB] text-[#B45309]",
  },
  {
    time: "12:00 PM",
    label: "Phonics, Music & Storytelling",
    emoji: "📖",
    desc: "Interactive storybook sessions with puppets, Orff rhythm instruments, and Jolly Phonics sounds.",
    tag: "Language & Rhythm",
    tagColor: "bg-[#FDF2F8] text-[#BE185D]",
  },
  {
    time: "12:45 PM",
    label: "Hot Lunch & Relaxation",
    emoji: "🍲",
    desc: "Warm wholesome meal enjoyed family-style, followed by soothing quiet time and gentle wind-down.",
    tag: "Nourishment & Self-Care",
    tagColor: "bg-[#F0FDF4] text-[#166534]",
  },
  {
    time: "1:30 PM",
    label: "Rest & Sweet Dreams (Nap Time)",
    emoji: "😴",
    desc: "Sanitized individual cots, soft lullabies, and dim ambient lighting under dedicated teacher supervision.",
    tag: "Restorative Rest",
    tagColor: "bg-[#EEF2FF] text-[#3730A3]",
  },
  {
    time: "3:00 PM",
    label: "Wrap-up & Cheerful Departure",
    emoji: "🏡",
    desc: "Review of daily joys, gathering school bags, and secure parent/guardian handover with day logs.",
    tag: "Family Reconnection",
    tagColor: "bg-[#FFF7ED] text-[#C2410C]",
  },
];

export default function DayTimeline() {
  return (
    <section id="facilities" className="relative py-24 bg-gradient-to-b from-[#FFFDF7] via-[#FFF9EE] to-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <span className="inline-block bg-sunshine/30 text-[#6a5400] font-heading font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full mb-3">
          Daily Rhythm
        </span>
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3 text-[#3a2e4d]">A Day at Kaylan ⏰</h2>
        <p className="text-[#5b4b6b] max-w-xl mx-auto mb-16 text-base sm:text-lg">
          A thoughtful, predictable rhythm designed to balance child-led discovery, physical outdoor play, peaceful rest, and joyful learning.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-sunshine via-candy/40 to-leaf/50 -translate-x-1/2" />
        <div className="space-y-10">
          {DAY.map((d, i) => (
            <motion.div
              key={d.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${
                i % 2 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Center Circle Pin */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-lg border-4 border-sunshine flex items-center justify-center text-xl z-10">
                {d.emoji}
              </div>

              {/* Card */}
              <div
                className={`ml-16 md:ml-0 md:w-[calc(50%-2.5rem)] bg-white rounded-3xl p-6 shadow-md border border-sunshine/20 hover:shadow-lg transition-all hover:-translate-y-1 ${
                  i % 2 ? "md:text-right" : "md:text-left"
                }`}
              >
                <div className={`flex items-center gap-2 mb-2 ${i % 2 ? "md:justify-end" : "justify-start"}`}>
                  <span className="text-xs font-mono font-bold text-candy px-2.5 py-0.5 rounded-full bg-candy/10">
                    {d.time}
                  </span>
                  <span className={`text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full ${d.tagColor}`}>
                    {d.tag}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#3a2e4d] mb-1.5">{d.label}</h3>
                <p className="text-sm text-[#5b4b6b] leading-relaxed">{d.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Daycare & Extended Care Highlight Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-[#FFF5F7] via-[#FFF9EE] to-[#F0FFF4] rounded-3xl p-8 shadow-xl border-2 border-sunshine/40 text-center relative overflow-hidden"
        >
          <div className="inline-block bg-white px-4 py-1.5 rounded-full text-xs font-heading font-bold text-candy mb-3 shadow-sm">
            ✨ Extended After-School Care Available
          </div>
          <h3 className="font-display text-2xl font-bold text-[#3a2e4d] mb-2">
            Working Parents? Extended Daycare till 6:30 PM 🧸
          </h3>
          <p className="text-sm text-[#5b4b6b] max-w-2xl mx-auto mb-6 leading-relaxed">
            Our nurturing daycare wing offers evening milk & healthy snack, homework assistance, guided crafts, quiet reading nooks, and fun indoor games under loving adult care.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-heading font-bold text-[#3a2e4d]">
            <span className="bg-white/80 px-3.5 py-1.5 rounded-full shadow-sm">🛡️ Verified Female Staff</span>
            <span className="bg-white/80 px-3.5 py-1.5 rounded-full shadow-sm">📹 24/7 CCTV Safe Campus</span>
            <span className="bg-white/80 px-3.5 py-1.5 rounded-full shadow-sm">🍎 Organic Snacks Included</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
