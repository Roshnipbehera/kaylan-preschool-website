"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { FaqContent } from "@/lib/types/cms";
import { faqPageStructuredData } from "@/lib/seo/structuredData";

const SEED: FaqContent = {
  heading: "Frequently Asked Questions 📚",
  subtext: "Everything you need to know about our curriculum, safety, admissions, and child care.",
  faqs: [
    {
      q: "What age groups does Kaylan Preschool accept?",
      a: "We welcome children aged 1.5 to 6 years across our four foundational programs: Playgroup (1.5 – 2.5 yrs), Nursery (2.5 – 3.5 yrs), Junior KG (3.5 – 4.5 yrs), and Senior KG (4.5 – 6 yrs).",
    },
    {
      q: "What curriculum and teaching methodology do you follow?",
      a: "We blend authentic Montessori sensorial materials with the accredited Kreedo early learning framework. Our curriculum is fully aligned with India's National Education Policy (NEP 2020) and NCF-FS, focusing on hands-on numeracy, phonics, socio-emotional intelligence, and motor skills.",
    },
    {
      q: "What is the teacher-to-child ratio in your classrooms?",
      a: "We strictly maintain a 1:8 teacher-to-child ratio across all classrooms, accompanied by a dedicated, trained support attendant (didi). This ensures every toddler receives personalized attention, emotional warmth, and careful observation.",
    },
    {
      q: "Are the classrooms and campus covered by CCTV surveillance?",
      a: "Yes. Our campus is fully monitored 24/7 by high-definition CCTV cameras covering all indoor classrooms, corridors, dining halls, and outdoor play areas. Safety protocols include strict visitor logs and security verification at entry gates.",
    },
    {
      q: "Do you offer full-day daycare and extended care hours?",
      a: "Yes! Our daycare operates from 8:30 AM to 6:30 PM. It includes nutritious organic evening snacks, supervised nap time in sanitized individual cots, homework help, guided art/craft activities, and free play.",
    },
    {
      q: "How do you handle hygiene, sanitization, and health emergencies?",
      a: "Classrooms and educational apparatus are sanitized daily using child-safe, non-toxic disinfectants. All our staff are certified in Pediatric First Aid and CPR, and we have an empanelled pediatrician on-call for any medical needs.",
    },
    {
      q: "Does my child need to be completely toilet-trained before admission?",
      a: "No! We understand toilet learning is a gentle developmental milestone. Our teachers and empathetic caregivers work patiently alongside parents to support gentle, stress-free toilet independence.",
    },
    {
      q: "Is school transport available for Electronic City residents?",
      a: "Yes. We offer GPS-tracked, speed-governed air-conditioned school vans with mandatory seatbelts and a female caregiver onboard for safe doorstep pickup and drop-off across Electronic City and nearby areas.",
    },
  ],
};

const COLORS = ["#FF8FB1", "#6EC6FF", "#FFD93D", "#7ED957", "#FFA552", "#CDB4FF", "#FF8FB1", "#6EC6FF"];

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
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-candy/10 text-candy font-heading font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full mb-3">
            Parent Guide
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3 text-[#3a2e4d]">{data.heading}</h2>
          <p className="text-[#5b4b6b] text-base sm:text-lg max-w-xl mx-auto">{data.subtext}</p>
        </div>

        <div className="space-y-4">
          {data.faqs.map((f, i) => {
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            const isOpen = openIndex === i;
            return (
              <div
                key={f.q}
                className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border-l-8 border border-black/5"
                style={{ borderLeftColor: COLORS[i % COLORS.length] }}
              >
                <h3>
                  <button
                    id={buttonId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 bg-[#FFFDF8] text-left font-heading font-bold text-[#3a2e4d] text-base sm:text-lg hover:bg-white transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span>{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      aria-hidden="true"
                      className="text-candy shrink-0 ml-4"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-white"
                    >
                      <p className="px-6 pb-6 pt-2 text-sm sm:text-base text-[#5b4b6b] leading-relaxed border-t border-black/5">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div className="mt-14 bg-gradient-to-r from-[#EAF8FF] to-[#FFF6E0] rounded-3xl p-8 text-center border border-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="font-display text-xl font-bold text-[#3a2e4d]">Still have questions?</h3>
            <p className="text-sm text-[#5b4b6b] mt-1">Our friendly admissions team is here to help you every step of the way.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/919663630221?text=Hello%20Kaylan%20Preschool!%20I%20have%20a%20question%20about%20admissions."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-heading font-bold text-sm px-5 py-3 rounded-full shadow hover:scale-105 transition-transform"
            >
              <span>💬</span> Chat on WhatsApp
            </a>
            <a
              href="#admissions"
              className="inline-flex items-center gap-2 bg-white text-[#3a2e4d] font-heading font-bold text-sm px-5 py-3 rounded-full shadow hover:scale-105 transition-transform border border-black/10"
            >
              <span>🏫</span> Book a Tour
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
