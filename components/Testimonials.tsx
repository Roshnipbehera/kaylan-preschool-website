"use client";
import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { TestimonialsContent } from "@/lib/types/cms";

const SEED: TestimonialsContent = {
  heading: "Parent Testimonials 💌",
  subtext: "Straight from the hearts of our Kaylan families.",
  reviews: [
    { name: "Priya R.", quote: "Kaylan gave our daughter confidence we never expected at this age.", stars: 5 },
    { name: "Rohit S.", quote: "My son runs to school every morning now — that says it all!", stars: 5 },
    { name: "Meera N.", quote: "The Kreedo curriculum plus the warmth of the teachers is unbeatable.", stars: 5 },
  ],
};

const PARENT_REVIEWS = [
  {
    name: "Priya Ramanathan",
    role: "Mother of Ananya (Nursery)",
    location: "NeoTown, Electronic City",
    avatarBg: "bg-candy text-white",
    quote:
      "Kaylan gave our daughter confidence we never expected at this age. The Montessori sensorial materials and Kreedo phonics approach transformed her curiosity. She speaks with clarity and joy!",
    stars: 5,
  },
  {
    name: "Rohit & Shweta Sharma",
    role: "Parents of Vihaan (Junior KG)",
    location: "Phase 1, Bangalore",
    avatarBg: "bg-sky text-[#3a2e4d]",
    quote:
      "My son literally runs into the school gates every morning! The teachers treat every child with genuine motherly warmth, and the daily activity updates on the parent portal give us complete peace of mind.",
    stars: 5,
  },
  {
    name: "Meera & Arvind Nair",
    role: "Parents of Kabir (Playgroup)",
    location: "Electronic City",
    avatarBg: "bg-sunshine text-[#4a3b00]",
    quote:
      "The daycare facility till 6:30 PM is a blessing for two working tech parents. Nutritious warm food, safe clean nap rooms, and CCTV monitoring make Kaylan the top choice in this area.",
    stars: 5,
  },
];

export default function Testimonials() {
  const { data } = useCmsSection("testimonials", SEED);
  return (
    <section id="testimonials" className="relative py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center relative">
        {/* Google Reviews Trust Pill */}
        <div className="inline-flex items-center gap-2 bg-[#FFFDF5] border border-sunshine/40 px-4 py-1.5 rounded-full text-xs font-heading font-semibold text-[#4a3b00] mb-4 shadow-sm">
          <span className="text-sunshine font-bold">★★★★★</span>
          <span>4.9 / 5.0 on Google Reviews (150+ Verified Parents)</span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">{data.heading}</h2>
        <p className="text-[#5b4b6b] max-w-xl mx-auto mb-14">{data.subtext}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PARENT_REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-gradient-to-b from-[#FBF9FF] to-[#F3EEFF] rounded-3xl p-7 text-left shadow-lg border border-lavender/30 flex flex-col justify-between"
            >
              <div className="absolute -top-3 left-8 w-6 h-6 bg-[#FBF9FF] rotate-45 border-t border-l border-lavender/30" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-sunshine">
                    {Array.from({ length: r.stars }).map((_, s) => (
                      <Star key={s} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[10px] font-heading font-semibold text-candy bg-candy/10 px-2.5 py-0.5 rounded-full">
                    ✓ Verified Parent
                  </span>
                </div>
                <p className="text-sm text-[#4a3b5a] leading-relaxed italic mb-6">
                  &quot;{r.quote}&quot;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-lavender/20">
                <div
                  className={`w-10 h-10 rounded-full ${r.avatarBg} font-heading font-bold flex items-center justify-center text-sm shadow`}
                >
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-heading font-bold text-sm text-[#3a2e4d]">{r.name}</p>
                  <p className="text-[11px] text-[#8a7a9a]">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
