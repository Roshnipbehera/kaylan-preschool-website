"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageCircle, ExternalLink, ShieldCheck, HeartHandshake, School } from "lucide-react";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { TestimonialsContent } from "@/lib/types/cms";

const GOOGLE_MAPS_REVIEWS_URL =
  "https://www.google.com/maps/place/Kaylan+Preschool/@12.8476486,77.6424096,17z/data=!4m8!3m7!1s0x3bae6b9b672e8d85:0xd95610aa3ce6c9e2!8m2!3d12.8476486!4d77.6424096!9m1!1b1!16s%2Fg%2F11vk7cj610!18m1!1e1?entry=ttu";

const SEED: TestimonialsContent = {
  heading: "Parent Stories & Google Reviews 💌",
  subtext: "Authentic, unfiltered reviews from verified parents on Google Maps and Justdial.",
  reviews: [
    {
      name: "Eswararao Agasti",
      role: "Parent of Kaylan Student",
      stars: 5,
      date: "3 months ago",
      source: "Google Reviews",
      verified: true,
      quote:
        'Excellent "Kaylan preschool" with caring teachers and a safe, friendly environment. My child loves going to school and has learned so much in a short time. The staff are supportive, and the activities are fun and educational. Highly recommended for every parent!',
      response:
        "Thank you so much for your kind words! 😊 We're thrilled to hear your child loves going to school and is learning well. It's a joy having your family as part of our community!",
    },
    {
      name: "Padmapriya",
      role: "Mother of Nursery Student",
      stars: 5,
      date: "3 months ago",
      source: "Google Reviews",
      verified: true,
      quote:
        "I am so happy with this school. The teachers took great care of my child. They teach children in a very practical and engaging way that makes it easy for them to understand and grasp concepts. My son is in nursery, and he has already started to identify pictures and learn well. I’m truly grateful to the school and staff.",
      response:
        "This made our whole team smile! 😊 Thank you for noticing the care and effort of our teachers. We're so glad your son is enjoying nursery and growing every day!",
    },
    {
      name: "Ranjitha Suchith",
      role: "Parent of Kaylan Student",
      stars: 5,
      date: "3 months ago",
      source: "Google Reviews",
      verified: true,
      quote:
        "A good preschool with a caring and positive environment. My son loves going to school every day and has learned so much. Thank you to all the staff for your dedication and support. Highly recommended!",
      response:
        "We're so grateful for your feedback! Seeing children excited to come to school is our greatest reward. Thank you for trusting us with your son's early years!",
    },
    {
      name: "Archita Sharma",
      role: "Parent (Enrolled from 1.5 yrs)",
      stars: 5,
      date: "9 months ago",
      source: "Google Reviews",
      verified: true,
      quote:
        "My kid has been going to this school since she was 1.5 years old. I must say the attention and care teachers provide there to kids have been applauding. My kid has learnt so much there and I love how the atmosphere there is so positive. They celebrate every small festival and kids learn to explore, celebrate, and share the joy together.",
      response:
        "Thank you so much for sharing your wonderful experience with us ❤️! We're absolutely delighted to have had your little one with us since she was 1.5 years old.",
    },
    {
      name: "Chindum Vasantha",
      role: "Parent in Prakruthi Layout",
      stars: 5,
      date: "10 months ago",
      source: "Google Reviews",
      verified: true,
      quote:
        "Kaylan Preschool in Prakruthi Layout has been an amazing experience for our child! The teachers are caring, attentive, and truly passionate about early childhood development. The learning environment is nurturing, safe, and full of fun activities that spark curiosity. Our child has grown socially, emotionally, and academically since joining. Highly recommend!",
      response:
        "Thank you so much for your wonderful feedback! We're delighted to hear that your child has grown socially, emotionally, and academically.",
    },
  ],
};

const AVATAR_COLORS = [
  "bg-candy text-white",
  "bg-teal text-white",
  "bg-sunshine text-[#4a3b00]",
  "bg-[#7C3AED] text-white",
  "bg-[#0284C7] text-white",
];

export default function Testimonials() {
  const { data } = useCmsSection("testimonials", SEED);
  const reviews = data.reviews && data.reviews.length > 0 ? data.reviews : SEED.reviews;
  const [openResponseIdx, setOpenResponseIdx] = useState<number | null>(null);

  const toggleResponse = (idx: number) => {
    setOpenResponseIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="testimonials" className="relative py-24 bg-white overflow-hidden">
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-sunshine/15 via-candy/10 to-teal/15 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Google Reviews Trust Bar & Header */}
        <div className="text-center mb-12">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#FFFDF5] via-[#F9F7FF] to-[#F0FFF9] border border-sunshine/50 px-5 py-2.5 rounded-full text-xs sm:text-sm font-heading font-semibold text-[#3a2e4d] mb-5 shadow-sm">
            {/* Google Multi-color G Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.39 7.35 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span className="text-[#1A73E8] font-bold">Google Maps Verified</span>
            <span className="text-gray-300">|</span>
            <span className="inline-flex items-center gap-1 text-[#b45309] font-bold">
              ★ 4.8 / 5.0
            </span>
            <span>(45+ Parent Reviews)</span>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span className="text-teal font-bold hidden sm:inline">5.0 ★ Justdial</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[#2e1d3e]">
            {data.heading}
          </h2>
          <p className="text-[#5b4b6b] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {data.subtext}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {reviews.map((r, i) => {
            const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const isResponseOpen = openResponseIdx === i;

            return (
              <motion.div
                key={`${r.name}-${i}`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="relative bg-gradient-to-b from-[#FCFBFF] via-white to-[#F7F4FD] rounded-3xl p-6 sm:p-7 text-left shadow-md hover:shadow-xl transition-all duration-300 border border-lavender/40 flex flex-col justify-between group"
              >
                {/* Speech Bubble Accent */}
                <div className="absolute -top-2.5 left-8 w-5 h-5 bg-[#FCFBFF] rotate-45 border-t border-l border-lavender/40" />

                <div>
                  {/* Top Bar: Stars + Google Badge + Date */}
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-1 text-sunshine">
                      {Array.from({ length: r.stars || 5 }).map((_, s) => (
                        <Star key={s} size={15} fill="currentColor" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-heading font-semibold text-teal bg-teal/10 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-teal" />
                      <span>{r.source || "Google Review"}</span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-[#3d2e4d] leading-relaxed italic mb-5">
                    &quot;{r.quote}&quot;
                  </p>
                </div>

                {/* Footer of Card: Reviewer Details + Response toggle */}
                <div className="pt-4 border-t border-lavender/25 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full ${avatarColor} font-heading font-bold flex items-center justify-center text-sm shadow-sm shrink-0`}
                      >
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-sm text-[#2e1d3e] truncate">
                          {r.name}
                        </p>
                        <p className="text-[11px] text-[#7a6b8a] truncate">
                          {r.role || "Kaylan Parent"} {r.date ? `· ${r.date}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Optional School Response Box */}
                  {r.response && (
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleResponse(i)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-heading font-semibold text-candy hover:text-candy/80 transition-colors"
                        aria-expanded={isResponseOpen}
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>
                          {isResponseOpen ? "Hide Response" : "View School Response"}
                        </span>
                      </button>

                      <AnimatePresence>
                        {isResponseOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mt-2"
                          >
                            <div className="bg-[#FAF5FF] border border-candy/20 rounded-2xl p-3 text-xs text-[#523966] leading-relaxed">
                              <p className="font-heading font-bold text-candy text-[11px] mb-1 flex items-center gap-1">
                                <School className="w-3 h-3" />
                                <span>Kaylan Preschool Leadership</span>
                              </p>
                              <p className="italic">{r.response}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Social Proof CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="relative bg-gradient-to-br from-[#FFF9EE] via-[#FFF3D6] to-[#FFE8BD] rounded-3xl p-7 text-left shadow-md hover:shadow-xl transition-all duration-300 border border-sunshine/40 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/80 border border-sunshine/40 flex items-center justify-center text-2xl shadow-sm mb-4">
                ⭐
              </div>
              <h3 className="font-display text-xl font-bold text-[#4a3b00] mb-2">
                Join 150+ Delighted Families
              </h3>
              <p className="text-xs sm:text-sm text-[#665200] leading-relaxed mb-4">
                Rated <strong>4.8 / 5.0</strong> by 45+ parents on Google Maps and <strong>5.0 / 5.0</strong> on Justdial. See why parents across Bettadasanapura & Electronic City Phase 1 trust Kaylan Preschool.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-sunshine/30">
              <a
                href={GOOGLE_MAPS_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#2e1d3e] hover:bg-[#1f132b] text-white font-heading font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <span>Read All 45+ Google Reviews</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="#visit-form"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-white/90 text-[#4a3b00] border border-sunshine/60 font-heading font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-candy" />
                <span>Book Campus Walkthrough</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Banner with Direct Google Link */}
        <div className="mt-12 text-center">
          <p className="text-xs text-[#7a6b8a] mb-2">
            Want to share your experience with Kaylan Preschool?
          </p>
          <a
            href={GOOGLE_MAPS_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-candy hover:text-candy/80 underline underline-offset-4 transition-colors"
          >
            <span>Write a Review on Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
