import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Heart, Award, Users, GraduationCap, CheckCircle2, Mail, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Careers & Teaching Opportunities",
  description:
    "Join the teaching family at Kaylan Preschool in Electronic City, Bangalore. Openings for Montessori guides, nursery educators, and daycare caretakers.",
};

const OPEN_ROLES = [
  {
    title: "Lead Montessori Guide (Playgroup & Nursery)",
    type: "Full-Time",
    experience: "2–5 Years",
    requirements: [
      "AMI / IMC or equivalent recognized Montessori diploma",
      "Warm, empathetic personality with deep patience for toddlers",
      "Strong spoken English communication and storytelling ability",
      "Experience with sensorial didactic apparatus and circle time",
    ],
  },
  {
    title: "Kindergarten Educator (Junior / Senior KG)",
    type: "Full-Time",
    experience: "2–4 Years",
    requirements: [
      "Degree in Early Childhood Education (ECE) / NTT / B.Ed",
      "Proficiency with Jolly Phonics and foundational math concepts",
      "Ability to create engaging lesson charts, puppets, and craft activities",
      "Skilled in documenting developmental milestones and parent updates",
    ],
  },
  {
    title: "Daycare Coordinator & Caregiver",
    type: "Full-Time / Afternoon Shift",
    experience: "1–3 Years",
    requirements: [
      "Passionate about toddler hygiene, nutrition, and peaceful rest routines",
      "First aid and child safety awareness",
      "Loving disposition and attentive supervision skills",
    ],
  },
  {
    title: "Music, Rhythm & Movement Instructor",
    type: "Part-Time / Visiting",
    experience: "1+ Years",
    requirements: [
      "Background in vocal music, percussion (Orff), or creative movement",
      "Enthusiastic energy to lead group sing-alongs and mini stage dramas",
    ],
  },
];

const PERKS = [
  {
    icon: GraduationCap,
    title: "Paid Professional Development",
    desc: "Regular funded workshops in AMI Montessori methodology, Kreedo tools, and positive child psychology.",
  },
  {
    icon: Users,
    title: "Optimal 1:8 Student Ratio",
    desc: "Never feel overwhelmed with 30 children in a room. Small, intimate batches ensure you build meaningful bonds.",
  },
  {
    icon: Award,
    title: "Competitive Compensation",
    desc: "Industry-leading salary packages, timely annual increments, PF/ESI benefits, and paid festival leaves.",
  },
  {
    icon: Heart,
    title: "Joyful, Respectful Culture",
    desc: "A cooperative team of educators with zero micromanagement. Your creative ideas are championed and celebrated.",
  },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF6EF]/70 via-[#FFF9EE]/40 to-white pt-14 pb-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-heading font-semibold text-candy border border-candy/20 shadow-sm mb-6">
              <Briefcase size={14} className="text-candy" />
              We Are Hiring for Academic Year 2026-27
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#3a2e4d]">
              Inspire Young Hearts at <span className="text-candy">Kaylan</span> 🌷
            </h1>
            <p className="mt-5 text-lg sm:text-xl font-body text-[#5b4b6b] max-w-3xl mx-auto leading-relaxed">
              Teaching at Kaylan Preschool is more than a job — it’s a shared calling to give children their
              happiest, most magical early years.
            </p>
          </div>
        </section>

        {/* Why Teach With Us */}
        <section className="py-16 max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-heading font-bold tracking-wider text-candy uppercase bg-candy/10 px-3 py-1 rounded-full">
              Work Culture
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3a2e4d] mt-4">
              Why Educators Love Working at Kaylan
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 hover:border-candy/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-candy/10 text-candy flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#3a2e4d] mb-2">{p.title}</h3>
                  <p className="text-xs text-[#5b4b6b] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 bg-[#FAF8FF]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl font-bold text-[#3a2e4d]">Current Openings</h2>
              <p className="text-sm text-[#5b4b6b] mt-2">
                Join our team at our Electronic City Phase 1 campus.
              </p>
            </div>

            <div className="space-y-6">
              {OPEN_ROLES.map((role) => (
                <div
                  key={role.title}
                  className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between md:items-start gap-6"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-heading font-bold bg-candy/10 text-candy">
                        {role.type}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[11px] font-heading font-bold bg-sunshine/20 text-[#6B5300]">
                        Experience: {role.experience}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-[#3a2e4d] mb-3">{role.title}</h3>
                    <ul className="space-y-2 mb-4">
                      {role.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2 text-xs text-[#5b4b6b]">
                          <CheckCircle2 size={15} className="text-leaf shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="shrink-0">
                    <a
                      href={`mailto:careers@kaylanpreschool.com?subject=Application%20for%20${encodeURIComponent(role.title)}`}
                      className="inline-flex items-center gap-2 bg-candy text-white font-heading font-bold px-6 py-3 rounded-full text-xs shadow-md hover:bg-candy/90 hover:scale-105 transition-all"
                    >
                      <Mail size={15} />
                      Apply via Email
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Email Box */}
            <div className="mt-12 bg-white rounded-3xl p-8 border border-candy/20 shadow-sm text-center max-w-xl mx-auto">
              <h3 className="font-heading text-lg font-bold text-[#3a2e4d] mb-1">Don&apos;t See a Matching Role?</h3>
              <p className="text-xs text-[#5b4b6b] mb-4">
                We are always eager to meet enthusiastic teachers! Send your resume and a short note to:
              </p>
              <a
                href="mailto:careers@kaylanpreschool.com"
                className="font-heading font-bold text-candy text-base hover:underline"
              >
                careers@kaylanpreschool.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
