import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Sun, Wind, Camera, Sparkle, HeartHandshake, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Campus Facilities & Safety",
  description:
    "Take a tour of our 10,000 sq.ft child-safe green preschool campus in Electronic City Phase 1, Bangalore. CCTV security, Montessori labs, outdoor turf, and day-care nap suites.",
};

const FACILITIES = [
  {
    title: "Reception & Indoor Activity Lounge",
    icon: Sparkles,
    image: "/images/gmaps-campus-reception.jpg",
    desc: "A warm, cheerful entrance and welcome lounge featuring authentic hand-painted storybook murals, child-height reception benches, and an active discovery play floor.",
  },
  {
    title: "10,000 Sq.Ft Lush Green Campus",
    icon: Sun,
    image: "/images/gallery-outdoor.jpg",
    desc: "A rare open-air green expanse in the heart of Bangalore's IT hub, featuring flowering native gardens, fresh breeze circulation, and rubberized impact turf for safe running.",
  },
  {
    title: "Montessori Sensorial Lab",
    icon: Sparkles,
    image: "/images/gallery-blocks.jpg",
    desc: "Child-height wooden open shelving equipped with authentic Montessori apparatus and Kreedo didactic materials that encourage purposeful, self-chosen exploration.",
  },
  {
    title: "The Storybook Reading Loft",
    icon: Sparkle,
    image: "/images/gallery-reading.jpg",
    desc: "A cosy sanctuary filled with plush floor cushions, fairy lights, and over 1,000 hand-picked international picture books and sensory touch-and-feel tales.",
  },
  {
    title: "Creative Arts & Music Studio",
    icon: Sparkle,
    image: "/images/gallery-art.jpg",
    desc: "Spacious studio featuring twin painting easels, non-toxic organic clay, child-safe watercolor stations, and Orff percussion instruments for rhythm and movement.",
  },
  {
    title: "Daycare & After-School Sanctuary",
    icon: HeartHandshake,
    image: "/images/gallery-music.jpg",
    desc: "Quiet, climate-controlled rest suite with individual sanitized wooden cots, homework guidance stations, and loving caregiver supervision for ages 1 to 10 years till 6:30 PM.",
  },
];

const SAFETY_FEATURES = [
  {
    title: "100% High-Def CCTV Coverage",
    desc: "Every indoor classroom, corridor, playground corner, and entry gate is monitored 24/7 with strict administrative audit trails.",
  },
  {
    title: "Child-Proof Ergonomic Architecture",
    desc: "Every wall corner is rounded, doors are equipped with German rubber finger-pinch guards, and electrical sockets are positioned above adult eye levels.",
  },
  {
    title: "Non-Toxic, Eco-Certified Materials",
    desc: "All wooden toys, chalks, wall paints, and sensory clays are 100% organic, lead-free, and dermatologically tested for delicate toddler skin.",
  },
  {
    title: "Biometric & Verified Parent Pickup",
    desc: "No child is released without dual-factor authentication and verified parent authorization ID cards.",
  },
  {
    title: "Child-Sized Restrooms & Hygiene",
    desc: "Ergonomic toddler toilet seats, low washbasins, warm water dispensing, and trained lady attendants for continuous potty guidance.",
  },
  {
    title: "First-Aid & Pediatrician on Call",
    desc: "Certified pediatric first-aid trained guides on-site at all hours, emergency oxygen protocols, and priority hospital tie-ups in Electronic City.",
  },
];

export default function FacilitiesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#BEE7FF]/60 via-[#E4F5FF]/40 to-white pt-14 pb-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-heading font-semibold text-candy border border-candy/20 shadow-sm mb-6">
              <ShieldCheck size={14} className="text-leaf" />
              100% Child-Safe Green Campus
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#3a2e4d]">
              Our Campus & <span className="text-candy">Facilities</span> 🏰
            </h1>
            <p className="mt-5 text-lg sm:text-xl font-body text-[#5b4b6b] max-w-3xl mx-auto leading-relaxed">
              Step into 10,000 square feet of sunshine, safety, and storybook charm. Designed from a child’s
              perspective with zero compromises on security and hygiene.
            </p>
          </div>
        </section>

        {/* Facilities Grid */}
        <section className="py-16 max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FACILITIES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all flex flex-col group"
              >
                <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={f.image}
                    alt={f.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <p className="font-heading font-bold text-sm drop-shadow">{f.title}</p>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#5b4b6b] leading-relaxed mb-4">{f.desc}</p>
                  <div className="flex items-center gap-1 text-[11px] font-heading font-bold text-candy">
                    <span>Child-approved learning space</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety First Section */}
        <section className="py-20 bg-[#F0FDF4]/60 border-y border-leaf/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-heading font-bold tracking-wider text-leaf uppercase bg-leaf/10 px-3 py-1 rounded-full">
                Safety & Hygiene Matrix
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3a2e4d] mt-4">
                Because Peace of Mind is Priceless
              </h2>
              <p className="text-sm text-[#5b4b6b] mt-3">
                We believe security should be invisible to children so they feel free, yet impenetrable so parents breathe easy.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SAFETY_FEATURES.map((s) => (
                <div key={s.title} className="bg-white rounded-2xl p-6 shadow-sm border border-leaf/20">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={20} className="text-leaf shrink-0" />
                    <h3 className="font-heading font-bold text-sm text-[#3a2e4d]">{s.title}</h3>
                  </div>
                  <p className="text-xs text-[#5b4b6b] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gradient-to-r from-candy via-[#FF758F] to-[#FF8FA3] text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl font-bold mb-3">Come Take a Walk Through Our Green Campus</h2>
            <p className="text-white/90 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              We would love to show you around! Meet our principal, inspect our Montessori classrooms, and let your child test out our outdoor lawn.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-candy font-heading font-bold px-8 py-3.5 rounded-full shadow-xl hover:bg-sunshine hover:text-[#4a3b00] transition-colors text-sm"
              >
                Schedule Tour Now
              </Link>
              <Link
                href="/admissions/apply"
                className="bg-white/20 backdrop-blur-md text-white font-heading font-bold px-8 py-3.5 rounded-full border border-white/40 hover:bg-white/30 transition-colors text-sm"
              >
                Apply for Admission
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
