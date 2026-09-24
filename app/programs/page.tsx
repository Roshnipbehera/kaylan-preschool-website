import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, CheckCircle2, Sparkles, BookOpen, Sun, Music, Heart, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgeFeeCalculator from "@/components/AgeFeeCalculator";

export const metadata: Metadata = {
  title: "Academic Programs & Daycare",
  description:
    "Explore Playgroup, Nursery, Junior KG, Senior KG, and Extended Daycare programs at Kaylan Preschool Electronic City, Bangalore. Small batches, Montessori & Kreedo curriculum.",
};

const PROGRAMS = [
  {
    id: "playgroup",
    title: "Playgroup (L0)",
    age: "2 – 3 Years",
    timing: "8:30 AM – 12:00 PM",
    badge: "Level 0 · First Steps",
    badgeColor: "bg-candy/15 text-candy border-candy/30",
    bgGradient: "from-candy/10 via-white to-white",
    description:
      "A gentle, nurturing bridge from home to the world. We prioritize emotional security, sensory play, language listening, and positive separation transition.",
    highlights: [
      "Tactile & sensory discovery (sand, water, clay, textures)",
      "Fine & gross motor development exercises",
      "Musical rhymes, circle time & social smiles",
      "Potty training support & self-feeding confidence",
      "Low 1:6 caretaker to toddler attention",
    ],
  },
  {
    id: "nursery",
    title: "Nursery (L1)",
    age: "3 – 4 Years",
    timing: "8:30 AM – 12:30 PM",
    badge: "Level 1 · Wonder Years",
    badgeColor: "bg-sky/20 text-sky border-sky/30",
    bgGradient: "from-sky/10 via-white to-white",
    description:
      "Nurturing blossoming curiosity through interactive phonics, pre-math spatial tools, color identification, and rhythmic creative expression.",
    highlights: [
      "Jolly Phonics letter sounds & vocabulary building",
      "Montessori sensorial cylinders, shapes & sorting",
      "Early mathematical number recognition & counting",
      "Storytelling sessions with expressive puppets",
      "Collaborative social play & sharing habits",
    ],
  },
  {
    id: "junior-kg",
    title: "Junior KG (L3)",
    age: "4 – 5 Years",
    timing: "8:30 AM – 1:00 PM",
    badge: "Level 3 · Little Thinkers",
    badgeColor: "bg-leaf/20 text-leaf border-leaf/30",
    bgGradient: "from-leaf/10 via-white to-white",
    description:
      "Fostering independent logical thinking, structured pencil grip, pre-reading fluency, and natural science fascination through hands-on experiments.",
    highlights: [
      "Blending two & three-letter words (CVC words)",
      "Addition & subtraction concepts using Kreedo beads",
      "Environmental science: plants, animals, seasons, space",
      "Pre-writing curves, patterns & fine motor control",
      "Show-and-tell public speaking & confidence building",
    ],
  },
  {
    id: "senior-kg",
    title: "Senior KG (L4)",
    age: "5 – 6 Years",
    timing: "8:30 AM – 1:30 PM",
    badge: "Level 4 · School Ready",
    badgeColor: "bg-lavender/25 text-[#7C3AED] border-lavender/40",
    bgGradient: "from-lavender/10 via-white to-white",
    description:
      "Complete school-readiness program preparing children for premier ICSE, CBSE, and IB primary schools with strong language, math, and self-management mastery.",
    highlights: [
      "Independent paragraph reading, comprehension & sight words",
      "Mental math, place values, word problems & skip counting",
      "STEM curiosity: simple physics, density, magnets & optics",
      "Creative dramatics, roleplay & stage expression",
      "Executive function skills: task completion & neatness",
    ],
  },
  {
    id: "daycare",
    title: "Daycare (Toddlers to Primary)",
    age: "1 Year – 10 Years",
    timing: "8:30 AM – 6:30 PM (Flexible Shifts)",
    badge: "Loving Home Away From Home",
    badgeColor: "bg-sunshine/30 text-[#6B5300] border-sunshine/40",
    bgGradient: "from-sunshine/10 via-white to-white",
    description:
      "Designed specifically for working parents in Electronic City. A loving, secure sanctuary with freshly cooked warm meals, quiet sleep zones, and supervised child-centric recreation for ages 1 to 10 years.",
    highlights: [
      "Nutritious, hygienic hot lunch and fresh evening snacks",
      "Comfortable nap sanctuary with individual sanitized cots",
      "Gentle toddler care, diapering support & potty assistance",
      "Supervised playtime & screen-free creative activities",
      "Live CCTV monitored premises with strict safety logging",
    ],
  },
  {
    id: "after-school",
    title: "After-School Program",
    age: "4 – 10 Years",
    timing: "1:30 PM – 6:30 PM (Mon – Fri)",
    badge: "Homework & Enrichment",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    bgGradient: "from-emerald-50/40 via-white to-white",
    description:
      "A structured, productive, and joyful evening haven for primary schoolers returning from school. We provide personalized homework assistance, creative hobby workshops, and outdoor physical sports.",
    highlights: [
      "Dedicated mentor supervision for daily homework, reading & school projects",
      "Creative arts, origami, pottery, and craft studio",
      "Cognitive board games: chess, scrabble, and logic puzzles",
      "Lawn sports, badminton, and active physical play",
      "Fresh evening milk, healthy protein snacks, and safe pickup",
    ],
  },
];

const DAILY_SCHEDULE = [
  { time: "08:30 AM – 09:00 AM", event: "Warm Welcome & Free Choice Exploration", desc: "Children transition calmly, choose a Montessori learning tray, and greet friends." },
  { time: "09:00 AM – 09:30 AM", event: "Morning Circle & Rhymes", desc: "Calendar, weather check, theme song, breathing exercises, and conversational circle." },
  { time: "09:30 AM – 10:30 AM", event: "Kreedo & Montessori Work Cycle", desc: "Uninterrupted hands-on session focusing on literacy, numeracy, and sensorial apparatus." },
  { time: "10:30 AM – 11:00 AM", event: "Healthy Snack & Social Grace", desc: "Mindful eating habits, table manners, washing hands, and pleasant chatter." },
  { time: "11:00 AM – 11:45 AM", event: "Outdoor Adventure & Gross Motor", desc: "Turf playground, wooden obstacle balance beams, tricycle track, and sandpit fun." },
  { time: "11:45 AM – 12:30 PM", event: "Art, Music & Creative Studio", desc: "Finger-painting, clay modeling, percussion rhythm instruments, and dramatic play." },
  { time: "12:30 PM – 01:00 PM", event: "Storybook Nook & Reflection", desc: "Puppet theatre, interactive read-alouds, vocabulary game, and dismissal for morning shifts." },
  { time: "01:00 PM – 06:30 PM", event: "Daycare Lunch, Rest & Evening Clubs", desc: "Warm lunch, nap time, afternoon snack, outdoor recreation, and creative hobby clubs." },
];

export default function ProgramsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-white">
        {/* Header */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF6E0]/70 via-[#FFF9EE]/40 to-white pt-14 pb-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-heading font-semibold text-candy border border-candy/20 shadow-sm mb-6">
              <Sparkles size={14} className="text-sunshine fill-sunshine" />
              Admissions Open for Academic Year 2026-27
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#3a2e4d]">
              Our Learning <span className="text-candy">Programs</span> 🏡
            </h1>
            <p className="mt-5 text-lg sm:text-xl font-body text-[#5b4b6b] max-w-3xl mx-auto leading-relaxed">
              Every stage of your child’s earliest years is a unique developmental window. Our programs are designed
              to honour their natural pace while equipping them with lifelong confidence.
            </p>
          </div>
        </section>

        {/* Program Cards */}
        <section className="py-12 max-w-6xl mx-auto px-6">
          <div className="space-y-12">
            {PROGRAMS.map((prog, index) => (
              <div
                key={prog.id}
                id={prog.id}
                className={`rounded-[2.5rem] border-2 border-black/5 bg-gradient-to-br ${prog.bgGradient} p-8 sm:p-10 shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 pb-6 border-b border-black/5">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-heading font-bold border ${prog.badgeColor}`}>
                        {prog.badge}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#5b4b6b] bg-white px-3 py-1 rounded-full shadow-sm">
                        <Clock size={14} className="text-candy" />
                        {prog.timing}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3a2e4d]">{prog.title}</h2>
                    <p className="text-xs font-heading font-bold text-candy mt-1">Age Eligibility: {prog.age}</p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <Link
                      href={`/admissions/apply?program=${prog.id}`}
                      className="bg-candy text-white font-heading font-bold px-6 py-3 rounded-full text-xs shadow-md hover:bg-candy/90 hover:scale-105 transition-all"
                    >
                      Enroll Now
                    </Link>
                    <Link
                      href="/contact"
                      className="bg-white text-[#3a2e4d] font-heading font-bold px-6 py-3 rounded-full text-xs shadow-sm border border-black/10 hover:border-candy hover:text-candy transition-all"
                    >
                      Book a Visit
                    </Link>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-5 gap-8 items-start">
                  <div className="md:col-span-2">
                    <p className="text-[#5b4b6b] text-sm leading-relaxed mb-4">{prog.description}</p>
                    <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white">
                      <p className="text-xs font-heading font-bold text-[#3a2e4d] mb-1">Teacher-Child Ratio</p>
                      <p className="text-xs text-[#5b4b6b]">1:8 (1:6 for Playgroup) with dedicated support attendants.</p>
                    </div>
                  </div>

                  <div className="md:col-span-3 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm">
                    <h3 className="font-heading text-sm font-bold text-[#3a2e4d] mb-3">Key Developmental Milestones:</h3>
                    <ul className="space-y-2.5">
                      {prog.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-xs text-[#4a3b1a] leading-normal">
                          <CheckCircle2 size={16} className="text-leaf shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive NEP 2020 Age & Fee Calculator */}
        <AgeFeeCalculator />

        {/* Daily Schedule Routine */}
        <section className="py-20 bg-[#F7FAFC]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-heading font-bold tracking-wider text-candy uppercase bg-candy/10 px-3 py-1 rounded-full">
                Daily Rhythm
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3a2e4d] mt-4">
                A Day in the Life at Kaylan
              </h2>
              <p className="text-[#5b4b6b] mt-3 text-sm">
                Children thrive on predictable, joyful structures that balance active discovery with calming reflection.
              </p>
            </div>

            <div className="space-y-4">
              {DAILY_SCHEDULE.map((item, idx) => (
                <div
                  key={item.time}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 hover:border-candy/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="sm:w-1/3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-heading font-bold bg-sunshine/20 text-[#6B5300]">
                      {item.time}
                    </span>
                  </div>
                  <div className="sm:w-2/3">
                    <h4 className="font-heading font-bold text-sm text-[#3a2e4d]">{item.event}</h4>
                    <p className="text-xs text-[#5b4b6b] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Admission Requirements & Checklist */}
        <section className="py-16 max-w-5xl mx-auto px-6">
          <div className="bg-[#FFFDF5] border-2 border-sunshine/30 rounded-[2rem] p-8 sm:p-10">
            <h3 className="font-display text-2xl font-bold text-[#3a2e4d] mb-3">Admission Documents Checklist</h3>
            <p className="text-xs text-[#5b4b6b] mb-6">
              When finalizing your child’s enrollment, please have soft or hard copies of the following ready:
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-medium text-[#4a3b1a]">
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-sunshine/30 shadow-sm">
                <CheckCircle2 size={16} className="text-leaf shrink-0" />
                Child’s Birth Certificate
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-sunshine/30 shadow-sm">
                <CheckCircle2 size={16} className="text-leaf shrink-0" />
                Immunization / Vaccine Card
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-sunshine/30 shadow-sm">
                <CheckCircle2 size={16} className="text-leaf shrink-0" />
                4 Passport Size Photos of Child
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-sunshine/30 shadow-sm">
                <CheckCircle2 size={16} className="text-leaf shrink-0" />
                Parents’ Aadhar / ID Proof
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-sunshine/30 shadow-sm">
                <CheckCircle2 size={16} className="text-leaf shrink-0" />
                Address Proof (Bangalore)
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-sunshine/30 shadow-sm">
                <CheckCircle2 size={16} className="text-leaf shrink-0" />
                Emergency Contact Details
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gradient-to-r from-candy via-[#FF758F] to-[#FF8FA3] text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl font-bold mb-3">Ready to Give Your Child the Best Start?</h2>
            <p className="text-white/90 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              Admissions for the 2026-27 academic session are now open. Seats per batch are strictly limited to 12
              students to maintain our personalized 1:8 ratio.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/admissions/apply"
                className="bg-white text-candy font-heading font-bold px-8 py-3.5 rounded-full shadow-xl hover:bg-sunshine hover:text-[#4a3b00] transition-colors text-sm"
              >
                Apply Online Today
              </Link>
              <Link
                href="/contact"
                className="bg-white/20 backdrop-blur-md text-white font-heading font-bold px-8 py-3.5 rounded-full border border-white/40 hover:bg-white/30 transition-colors text-sm"
              >
                Schedule School Visit
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
