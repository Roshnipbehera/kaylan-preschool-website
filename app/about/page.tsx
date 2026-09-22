import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, Shield, Award, Users, BookOpen, Clock, CheckCircle2, Compass } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Kaylan Preschool in Electronic City, Bangalore — our Montessori & Kreedo philosophy, loving educators, child-first environment, and 10,000 sq.ft safe green campus.",
};

const STATS = [
  { value: "500+", label: "Happy Little Learners", icon: "🌱" },
  { value: "1:8", label: "Teacher to Child Ratio", icon: "👩‍🏫" },
  { value: "10,000", label: "Sq.Ft Green Campus", icon: "🏡" },
  { value: "100%", label: "Montessori & Kreedo Guided", icon: "⭐" },
];

const VALUES = [
  {
    icon: Heart,
    title: "Love & Respect First",
    desc: "Every child enters a sanctuary of gentleness where feelings are validated, voices are heard, and natural curiosity is celebrated without fear or pressure.",
    color: "bg-candy/10 text-candy border-candy/20",
  },
  {
    icon: Compass,
    title: "Child-Led Discovery",
    desc: "Guided by Montessori principles, children choose activities based on inner interests, building deep focus, self-discipline, and independent problem-solving.",
    color: "bg-leaf/10 text-leaf border-leaf/20",
  },
  {
    icon: Sparkles,
    title: "Kreedo Experiential Learning",
    desc: "Scientific wooden apparatus and sensory play materials make abstract mathematical, linguistic, and scientific concepts intuitive and tangible.",
    color: "bg-sunshine/20 text-[#7a5c00] border-sunshine/30",
  },
  {
    icon: Shield,
    title: "Uncompromising Safety",
    desc: "From 100% CCTV coverage and biometric parent pickup to rounded furniture and background-verified staff, child security is our paramount priority.",
    color: "bg-sky/15 text-sky border-sky/30",
  },
];

const PILLARS = [
  {
    num: "01",
    title: "The Wonder-Filled Environment",
    desc: "Our storybook-inspired campus in Electronic City Phase 1 features natural sunlight, organic greenery, child-height shelving, and thematic exploration zones tailored to early developmental stages.",
  },
  {
    num: "02",
    title: "Certified & Loving Mentors",
    desc: "Every guide at Kaylan holds certifications in Montessori and early childhood pedagogy, regularly trained in positive discipline, emotional co-regulation, and first aid.",
  },
  {
    num: "03",
    title: "Holistic School Readiness",
    desc: "Graduates transition seamlessly into top ICSE, CBSE, and International schools across Bangalore with advanced phonics, mental math agility, social confidence, and creativity.",
  },
  {
    num: "04",
    title: "Transparent Parent Partnership",
    desc: "Daily digital diary updates, real-time teacher messaging, milestone developmental portfolios, and welcoming parent workshops keep you intimately connected to your child's journey.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#BEE7FF]/60 via-[#DCF3FF]/40 to-white pt-14 pb-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-heading font-semibold text-candy border border-candy/20 shadow-sm mb-6">
              <Sparkles size={14} className="text-sunshine fill-sunshine" />
              Electronic City Phase 1, Bangalore
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#3a2e4d] leading-tight">
              Where Every Child’s Story Begins With <span className="text-candy">Wonder</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl font-body text-[#5b4b6b] max-w-3xl mx-auto leading-relaxed">
              Founded on the belief that early childhood should be an enchanting adventure of joyful play, 
              Kaylan Preschool blends Montessori self-paced exploration with the scientifically proven Kreedo curriculum.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/admissions/apply"
                className="bg-candy text-white font-heading font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-candy/30 hover:scale-105 transition-all text-sm"
              >
                Apply for Admission 2026-27
              </Link>
              <Link
                href="/contact"
                className="bg-white text-[#3a2e4d] font-heading font-bold px-7 py-3.5 rounded-full shadow-md border border-black/5 hover:border-candy hover:text-candy transition-all text-sm"
              >
                Book a Campus Tour
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="py-8 bg-[#FFFDF5] border-y border-sunshine/20">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label} className="p-3">
                <span className="text-2xl mb-1 block">{s.icon}</span>
                <p className="font-display text-3xl sm:text-4xl font-extrabold text-candy">{s.value}</p>
                <p className="text-xs sm:text-sm font-heading font-semibold text-[#5b4b6b] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Story & Mission */}
        <section className="py-20 max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
              <Image
                src="/images/hero-montessori.jpg"
                alt="Children exploring Montessori materials at Kaylan Preschool Bangalore"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="font-heading font-bold text-sm">Joyful Sensory Exploration</p>
                <p className="text-xs text-white/90">Hands-on Kreedo materials in our Electronic City campus</p>
              </div>
            </div>

            <div>
              <span className="text-xs font-heading font-bold tracking-wider text-candy uppercase bg-candy/10 px-3 py-1 rounded-full">
                Our Genesis
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3a2e4d] mt-4 mb-5">
                A Storybook World Created for Little Minds to Bloom
              </h2>
              <p className="text-[#5b4b6b] leading-relaxed mb-4">
                Kaylan Preschool was conceived by passionate early childhood educators who saw that modern urban learning
                often subjected toddlers to artificial pressure and premature worksheets. We set out to build something
                rare: a storybook sanctuary in Bangalore’s IT corridor where play is celebrated as the highest form of research.
              </p>
              <p className="text-[#5b4b6b] leading-relaxed mb-6">
                Spread across a sprawling, tree-lined 10,000 sq.ft environment in NeoTown Road, Electronic City Phase 1,
                we provide toddlers with the freedom to touch, question, build, make mistakes, and rejoice in discovery.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-black/5">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={20} className="text-leaf shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#3a2e4d]">No Rote Exams</h4>
                    <p className="text-xs text-[#5b4b6b]">Milestone-based joyful assessments</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={20} className="text-leaf shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#3a2e4d]">Safe Daycare</h4>
                    <p className="text-xs text-[#5b4b6b]">Loving care until 6:30 PM for IT parents</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-[#FAF8FF]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-heading font-bold tracking-wider text-candy uppercase bg-candy/10 px-3 py-1 rounded-full">
                Our Guiding Lights
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3a2e4d] mt-4">
                What Makes Kaylan Unique
              </h2>
              <p className="text-[#5b4b6b] mt-3">
                Every classroom rhythm, teacher interaction, and physical material is grounded in our four core principles.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-black/5 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-5 ${v.color}`}>
                        <Icon size={24} />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-[#3a2e4d] mb-2">{v.title}</h3>
                      <p className="text-xs text-[#5b4b6b] leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4 Pillars of Excellence */}
        <section className="py-20 max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-heading font-bold tracking-wider text-candy uppercase bg-candy/10 px-3 py-1 rounded-full">
              Educational Pillars
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3a2e4d] mt-4">
              The Four Cornerstones of a Kaylan Childhood
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {PILLARS.map((p) => (
              <div
                key={p.num}
                className="bg-white rounded-3xl p-8 border-2 border-[#FAF5FF] shadow-sm hover:border-candy/30 transition-all flex gap-5"
              >
                <span className="font-display text-3xl font-extrabold text-candy/40 shrink-0">{p.num}</span>
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#3a2e4d] mb-2">{p.title}</h3>
                  <p className="text-sm text-[#5b4b6b] leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Campus Gallery Snapshot */}
        <section className="py-16 bg-[#F0FDF4]/50 border-t border-leaf/10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3a2e4d]">Life Inside Our Campus</h2>
                <p className="text-sm text-[#5b4b6b]">Sneak peek into daily laughter, creativity, and exploration.</p>
              </div>
              <Link
                href="/gallery"
                className="text-sm font-heading font-bold text-candy hover:underline inline-flex items-center gap-1"
              >
                View Full Photo Gallery →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="relative h-44 rounded-2xl overflow-hidden shadow-sm">
                <Image src="/images/gallery-art.jpg" alt="Art and craft activities" fill sizes="33vw" className="object-cover hover:scale-105 transition-transform" />
              </div>
              <div className="relative h-44 rounded-2xl overflow-hidden shadow-sm">
                <Image src="/images/gallery-blocks.jpg" alt="Building blocks learning" fill sizes="33vw" className="object-cover hover:scale-105 transition-transform" />
              </div>
              <div className="relative h-44 rounded-2xl overflow-hidden shadow-sm col-span-2 sm:col-span-1">
                <Image src="/images/gallery-outdoor.jpg" alt="Outdoor play equipment" fill sizes="33vw" className="object-cover hover:scale-105 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 bg-gradient-to-r from-candy via-[#FF758F] to-[#FF8FA3] text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Experience the Magic in Person
            </h2>
            <p className="text-white/90 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              We welcome prospective parents for personalized campus walkthroughs Monday to Saturday.
              Come see our classrooms, meet our guides, and witness the joy firsthand.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-candy font-heading font-bold px-8 py-3.5 rounded-full shadow-xl hover:bg-sunshine hover:text-[#4a3b00] transition-colors text-sm"
              >
                Schedule Campus Walkthrough
              </Link>
              <Link
                href="/programs"
                className="bg-white/20 backdrop-blur-md text-white font-heading font-bold px-8 py-3.5 rounded-full border border-white/40 hover:bg-white/30 transition-colors text-sm"
              >
                Explore Programs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
