import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, BookOpen, Brain, Layers, Smile, Activity, Palette, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Curriculum & Methodology",
  description:
    "Learn about our Montessori-inspired & Kreedo integrated curriculum at Kaylan Preschool Bangalore. 6 discovery domains, sensory tactile apparatus, and stress-free milestone growth.",
};

const DOMAINS = [
  {
    icon: Layers,
    title: "1. Sensorial & Tactile Mastery",
    color: "from-[#FF8FB1]/20 to-white",
    border: "border-candy/30",
    iconColor: "text-candy",
    desc: "Montessori sensorial materials (Pink Tower, Brown Stairs, Cylinder Blocks) refine visual perception, spatial reasoning, tactile sensitivity, and fine discrimination.",
    outcomes: ["Grading dimensions & weights", "Recognizing geometric stereognostic shapes", "Refining auditory and olfactory senses"],
  },
  {
    icon: BookOpen,
    title: "2. Phonics & Language Joy",
    color: "from-[#6EC6FF]/20 to-white",
    border: "border-sky/30",
    iconColor: "text-sky",
    desc: "A phonetic, multisensory pathway combining Jolly Phonics sounds, sandpaper letters, movable alphabets, and picture story immersion to foster confident readers.",
    outcomes: ["42 core phonetic sounds & blends", "CVC word encoding & decoding", "Expressive vocabulary & stage narrative ability"],
  },
  {
    icon: Brain,
    title: "3. Concrete Foundational Math",
    color: "from-[#7ED957]/20 to-white",
    border: "border-leaf/30",
    iconColor: "text-leaf",
    desc: "Children touch math before writing symbols. Using Kreedo counting rods, spindle boxes, and golden bead systems, mathematical logic becomes tangible and intuitive.",
    outcomes: ["Decimal place values (Units, Tens, Hundreds)", "Spatial patterns & sequence sorting", "Real-world problem solving through games"],
  },
  {
    icon: Activity,
    title: "4. Science, Nature & STEM",
    color: "from-[#FFA552]/20 to-white",
    border: "border-[#FFA552]/30",
    iconColor: "text-[#FFA552]",
    desc: "Hands-on biological, physical, and environmental exploration. Children germinate organic seeds, explore magnetic forces, light refraction, and animal habitats.",
    outcomes: ["Observation & hypothesis formation", "Understanding weather, flora & ecology", "Care for living plants and classroom pets"],
  },
  {
    icon: Smile,
    title: "5. Practical Life & Emotional Quotient",
    color: "from-[#CDB4FF]/20 to-white",
    border: "border-[#7C3AED]/30",
    iconColor: "text-[#7C3AED]",
    desc: "Montessori 'Exercises of Practical Life' (pouring, buttoning, table setting, zipping) instill self-care, concentration, emotional resilience, and deep respect for peers.",
    outcomes: ["Self-reliance & independent dressing", "Conflict resolution through peaceful words", "Empathy, turn-taking & grace manners"],
  },
  {
    icon: Palette,
    title: "6. Creative Arts & Rhythm Movement",
    color: "from-[#FFD93D]/25 to-white",
    border: "border-sunshine/40",
    iconColor: "text-[#8a6800]",
    desc: "Free-form process art, clay sculpting, Orff rhythm percussion, folk storytelling, and creative dance stimulate both cerebral hemispheres and celebrate authentic expression.",
    outcomes: ["Color theory & textural experimentation", "Rhythm synchrony & auditory motor skills", "Joyful stage expression without inhibition"],
  },
];

const COMPARISON = [
  {
    metric: "Approach to Concepts",
    kaylan: "Concrete apparatus first (touch, feel, manipulate), then abstract symbols.",
    traditional: "Direct memorization of abstract letters & numbers on paper.",
  },
  {
    metric: "Learning Pace",
    kaylan: "Self-paced discovery. Children advance when ready without feeling rushed.",
    traditional: "Uniform pace forced on all children regardless of individual readiness.",
  },
  {
    metric: "Classroom Atmosphere",
    kaylan: "Calm, joyful focus with freedom of purposeful movement and choices.",
    traditional: "Rigid desk seating with forced silence and passive listening.",
  },
  {
    metric: "Assessment Philosophy",
    kaylan: "Zero exams. Continuous observational portfolios & milestone checklists.",
    traditional: "Stressful tests, rankings, red marks, and pressure.",
  },
  {
    metric: "Teacher's Role",
    kaylan: "Gentle guide & observer who facilitates and prompts child discovery.",
    traditional: "Authoritarian lecturer dispensing one-way instructions.",
  },
];

export default function CurriculumPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF8FF]/70 via-[#F3FAFF]/40 to-white pt-14 pb-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-heading font-semibold text-candy border border-candy/20 shadow-sm mb-6">
              <Sparkles size={14} className="text-sunshine fill-sunshine" />
              Montessori-Inspired & Kreedo Curriculum
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#3a2e4d]">
              The Joy of Learning Through <span className="text-candy">Discovery</span> 🧠
            </h1>
            <p className="mt-5 text-lg sm:text-xl font-body text-[#5b4b6b] max-w-3xl mx-auto leading-relaxed">
              We replace memorization drills with scientific wooden materials, sensory inquiry, and love. 
              Here, learning isn’t a chore — it’s an irresistible daily adventure.
            </p>
          </div>
        </section>

        {/* 6 Core Domains */}
        <section className="py-16 max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3a2e4d]">
              Our 6 Discovery Domains
            </h2>
            <p className="text-sm text-[#5b4b6b] mt-3">
              Holistic brain development across cognitive, linguistic, spatial, physical, and socio-emotional spheres.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DOMAINS.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.title}
                  className={`rounded-3xl border-2 ${d.border} bg-gradient-to-b ${d.color} p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-5 ${d.iconColor}`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#3a2e4d] mb-2">{d.title}</h3>
                    <p className="text-xs text-[#5b4b6b] leading-relaxed mb-5">{d.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-black/5">
                    <p className="text-[11px] font-heading font-bold text-[#3a2e4d] mb-2">Expected Milestones:</p>
                    <ul className="space-y-1.5">
                      {d.outcomes.map((o) => (
                        <li key={o} className="text-[11px] text-[#4a3b1a] flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-leaf shrink-0" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 bg-[#FAF8FF]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-heading font-bold tracking-wider text-candy uppercase bg-candy/10 px-3 py-1 rounded-full">
                Pedagogical Difference
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3a2e4d] mt-4">
                Why Kaylan’s Approach Outshines Traditional Preschools
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 text-left text-xs">
                <thead>
                  <tr className="bg-candy/10 font-heading text-[#3a2e4d] text-sm">
                    <th className="p-5">Dimension</th>
                    <th className="p-5 text-candy font-bold">Kaylan Preschool (Montessori + Kreedo)</th>
                    <th className="p-5 text-gray-500 font-medium">Traditional Preschools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {COMPARISON.map((row) => (
                    <tr key={row.metric} className="hover:bg-[#FAF9FF] transition-colors">
                      <td className="p-5 font-heading font-bold text-[#3a2e4d] w-1/4">{row.metric}</td>
                      <td className="p-5 text-[#3a2e4d] font-medium leading-relaxed w-3/8">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-leaf shrink-0 mt-0.5" />
                          <span>{row.kaylan}</span>
                        </div>
                      </td>
                      <td className="p-5 text-[#8a7a9a] leading-relaxed w-3/8">
                        <div className="flex items-start gap-2">
                          <XCircle size={16} className="text-gray-400 shrink-0 mt-0.5" />
                          <span>{row.traditional}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Milestone Reporting */}
        <section className="py-16 max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-sky/15 via-white to-sunshine/20 rounded-[2.5rem] p-8 sm:p-12 border border-sky/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-heading font-bold text-sky uppercase">Parent Transparency</span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#3a2e4d] mt-2 mb-4">
                  Milestone Portfolios Instead of Report Cards
                </h3>
                <p className="text-sm text-[#5b4b6b] leading-relaxed mb-4">
                  Every child maintains a personalized developmental portfolio. Rather than crude letter grades,
                  parents receive rich qualitative observations documenting their child’s fine motor dexterity,
                  social interactions, language emergence, and problem-solving triumphs.
                </p>
                <p className="text-xs text-[#5b4b6b]">
                  Parents can log in to our secure Parent Portal anytime to view attendance, teacher notes, fee receipts,
                  and milestone photographs.
                </p>
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-md border-2 border-white">
                <Image
                  src="/images/gallery-reading.jpg"
                  alt="Reading and phonics storytelling at Kaylan Preschool"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gradient-to-r from-candy via-[#FF758F] to-[#FF8FA3] text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl font-bold mb-3">See Our Curriculum in Action</h2>
            <p className="text-white/90 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              Book a live observation morning. Watch how our 3-year-olds independently select Montessori materials,
              engage with deep concentration, and clean up with proud smiles.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-candy font-heading font-bold px-8 py-3.5 rounded-full shadow-xl hover:bg-sunshine hover:text-[#4a3b00] transition-colors text-sm"
              >
                Book Observation Morning
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
