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

export default function Testimonials() {
  const { data } = useCmsSection("testimonials", SEED);
  return (
    <section id="testimonials" className="relative py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center relative">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">{data.heading}</h2>
        <p className="text-[#5b4b6b] max-w-xl mx-auto mb-14">{data.subtext}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-[#F5F0FF] rounded-3xl p-7 text-left"
            >
              <div className="absolute -top-3 left-8 w-6 h-6 bg-[#F5F0FF] rotate-45" />
              <div className="flex gap-1 mb-3 text-sunshine">
                {Array.from({ length: r.stars }).map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <p className="text-sm text-[#5b4b6b] italic mb-4">&quot;{r.quote}&quot;</p>
              <div className="flex items-center justify-between">
                <p className="font-heading font-bold text-sm">— {r.name}</p>
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
                  <Heart size={18} className="text-candy" fill="currentColor" />
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
