"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { FaqContent } from "@/lib/types/cms";
import { faqPageStructuredData } from "@/lib/seo/structuredData";

const SEED: FaqContent = {
  heading: "Storybook FAQ 📚",
  subtext: "Answers to the questions parents ask most.",
  faqs: [
    { q: "What age groups does Kaylan Preschool accept?", a: "We welcome children from 1.5 to 5.5 years across Playgroup, Nursery, Junior KG and Senior KG." },
    { q: "What curriculum do you follow?", a: "A Montessori-inspired approach combined with the structured Kreedo curriculum for Maths, English and holistic development." },
    { q: "Do you offer daycare?", a: "Yes! Full-day daycare is available with nap time, meals and enriching activities." },
    { q: "How do I book a school tour?", a: "Simply click 'Book a School Tour' or WhatsApp us — we'll schedule a visit at your convenience." },
  ],
};

const COLORS = ["#FF8FB1", "#6EC6FF", "#FFD93D", "#7ED957"];

export default function FAQ() {
  const { data } = useCmsSection("faq", SEED);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24 bg-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageStructuredData(data.faqs)) }}
      />
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-center mb-3">{data.heading}</h2>
        <p className="text-[#5b4b6b] text-center max-w-xl mx-auto mb-14">{data.subtext}</p>
        <div className="space-y-4">
          {data.faqs.map((f, i) => {
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <div key={f.q} className="rounded-2xl overflow-hidden shadow-md border-l-8" style={{ borderColor: COLORS[i % COLORS.length] }}>
                <h3>
                  <button
                    id={buttonId}
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 bg-[#FFFDF5] text-left font-heading font-semibold"
                    aria-expanded={openIndex === i}
                    aria-controls={panelId}
                  >
                    {f.q}
                    <motion.span animate={{ rotate: openIndex === i ? 180 : 0 }} aria-hidden="true">
                      <ChevronDown />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-white"
                    >
                      <p className="px-6 pb-5 text-sm text-[#5b4b6b]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
