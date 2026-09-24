"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Sparkles,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePublicSettings } from "@/lib/hooks/usePublicSettings";

interface GradeEligibility {
  id: string;
  name: string;
  badge: string;
  badgeBg: string;
  ageRange: string;
  timings: string;
  ratio: string;
  baseQuarterlyFee: number;
  baseAnnualFee: number;
  description: string;
  highlights: string[];
}

const GRADES: Record<string, GradeEligibility> = {
  playgroup: {
    id: "playgroup",
    name: "Playgroup (Toddlers)",
    badge: "First Steps 🐥",
    badgeBg: "bg-candy/15 text-candy border-candy/30",
    ageRange: "1.5 – 2.5 Years",
    timings: "9:00 AM – 12:00 PM (Mon – Fri)",
    ratio: "1:6 (Dedicated Caretaker & Guide)",
    baseQuarterlyFee: 18500,
    baseAnnualFee: 68000,
    description: "Sensory discovery, gentle home-to-school transition, tactile play, and emotional bonding.",
    highlights: ["Sensory sand & water play", "Potty training assistance", "Music & circle time", "Social smiles & sharing"],
  },
  nursery: {
    id: "nursery",
    name: "Nursery",
    badge: "Wonder Years 🌱",
    badgeBg: "bg-sky/20 text-[#0c5460] border-sky/30",
    ageRange: "2.5 – 3.5 Years",
    timings: "8:30 AM – 12:30 PM (Mon – Fri)",
    ratio: "1:8 (Lead Educator & Care Assistant)",
    baseQuarterlyFee: 21000,
    baseAnnualFee: 76000,
    description: "Jolly Phonics foundation, Montessori sensory cylinders, number recognition, and confidence.",
    highlights: ["Jolly Phonics letter sounds", "Pre-math & sorting games", "Puppet storytelling", "Outdoor gross motor gym"],
  },
  "junior-kg": {
    id: "junior-kg",
    name: "Junior KG (LKG)",
    badge: "Little Thinkers 🚀",
    badgeBg: "bg-leaf/20 text-[#2b6118] border-leaf/30",
    ageRange: "3.5 – 4.5 Years",
    timings: "8:30 AM – 1:00 PM (Mon – Fri)",
    ratio: "1:8 (Montessori Certified Guide)",
    baseQuarterlyFee: 23500,
    baseAnnualFee: 84000,
    description: "Structured writing grip, early phonemic reading, STEM experiments, and logical inquiry.",
    highlights: ["Early phonetic reading", "Concrete mathematics counting", "Nature & mini-botany", "Creative art & rhythm"],
  },
  "senior-kg": {
    id: "senior-kg",
    name: "Senior KG (UKG)",
    badge: "School Ready 🎓",
    badgeBg: "bg-sunshine/20 text-[#7a4e00] border-sunshine/40",
    ageRange: "4.5 – 5.5+ Years",
    timings: "8:30 AM – 1:30 PM (Mon – Fri)",
    ratio: "1:10 (Grade 1 Bridge Mentors)",
    baseQuarterlyFee: 25000,
    baseAnnualFee: 89000,
    description: "Complete Grade 1 readiness bridging CBSE, ICSE, and Cambridge curricula with public speaking.",
    highlights: ["Sentence construction & cursive", "Addition/subtraction concepts", "Independent public show & tell", "Science experiment lab"],
  },
};

const DAYCARE_OPTIONS = [
  { id: "none", label: "No Daycare (Preschool Only)", feeQuarterly: 0, feeAnnual: 0, hours: "Preschool Hours Only" },
  { id: "half", label: "Half-Day Daycare (Till 3:30 PM)", feeQuarterly: 9500, feeAnnual: 34000, hours: "Till 3:30 PM · Includes Nap & Hot Lunch" },
  { id: "full", label: "Extended Full-Day Daycare (Till 6:30 PM)", feeQuarterly: 16500, feeAnnual: 60000, hours: "Till 6:30 PM · Includes Lunch, Nap & Evening Snack" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Current Academic Year cutoff reference: June 1, 2026
const CUTOFF_YEAR = 2026;
const CUTOFF_MONTH = 5; // 0-indexed: June = 5

export default function AgeFeeCalculator() {
  const { data } = usePublicSettings();
  const rawPhone = data?.contactPhone || "+91 98860 12345";
  const phoneDigits = rawPhone.replace(/[^\d]/g, "") || "919886012345";

  // Default to child born in August 2022 (~3.8 yrs at June 2026 = Junior KG)
  const [birthYear, setBirthYear] = useState<number>(2023);
  const [birthMonth, setBirthMonth] = useState<number>(3); // April
  const [daycareOption, setDaycareOption] = useState<string>("none");
  const [billingCycle, setBillingCycle] = useState<"quarterly" | "annual">("quarterly");

  // Calculate age as of June 1, 2026
  const { ageYears, ageMonths, totalDecimalYears, eligibleGradeKey, statusMessage } = useMemo(() => {
    let y = CUTOFF_YEAR - birthYear;
    let m = CUTOFF_MONTH - birthMonth;
    if (m < 0) {
      y -= 1;
      m += 12;
    }
    const totalDecimal = y + m / 12;

    let gradeKey = "nursery";
    let statusMsg = "";

    if (totalDecimal < 1.5) {
      gradeKey = "playgroup";
      statusMsg = "Your toddler is below 1.5 years on June 1, 2026. Pre-registration or infant daycare is available!";
    } else if (totalDecimal >= 1.5 && totalDecimal < 2.5) {
      gradeKey = "playgroup";
    } else if (totalDecimal >= 2.5 && totalDecimal < 3.5) {
      gradeKey = "nursery";
    } else if (totalDecimal >= 3.5 && totalDecimal < 4.5) {
      gradeKey = "junior-kg";
    } else if (totalDecimal >= 4.5 && totalDecimal <= 5.8) {
      gradeKey = "senior-kg";
    } else {
      gradeKey = "senior-kg";
      statusMsg = "Child is over 5.8 years! Eligible for Senior KG or direct primary school Grade 1 entrance.";
    }

    return {
      ageYears: Math.max(0, y),
      ageMonths: Math.max(0, m),
      totalDecimalYears: totalDecimal,
      eligibleGradeKey: gradeKey,
      statusMessage: statusMsg,
    };
  }, [birthYear, birthMonth]);

  const selectedGrade = GRADES[eligibleGradeKey] || GRADES.nursery;
  const selectedDaycare = DAYCARE_OPTIONS.find((d) => d.id === daycareOption) || DAYCARE_OPTIONS[0];

  const estimatedTuition = billingCycle === "quarterly" ? selectedGrade.baseQuarterlyFee : selectedGrade.baseAnnualFee;
  const estimatedDaycare = billingCycle === "quarterly" ? selectedDaycare.feeQuarterly : selectedDaycare.feeAnnual;
  const totalEstimated = estimatedTuition + estimatedDaycare;

  const waEnquiryText = `Hello Kaylan Preschool! I used your NEP 2020 Age Calculator. My child is ${ageYears} yrs ${ageMonths} mos (born ${MONTHS[birthMonth]} ${birthYear}). Recommended class: ${selectedGrade.name}. I would like to schedule an admissions tour.`;
  const waHref = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(waEnquiryText)}`;

  return (
    <section id="calculator" className="relative py-20 bg-gradient-to-b from-white via-[#F4FBFA] to-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-candy/10 text-candy text-xs font-heading font-semibold mb-3 border border-candy/20">
            <Sparkles size={14} />
            <span>NEP 2020 Aligned · Academic Intake 2026-27</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#3a2e4d] tracking-tight">
            Child Age & Eligibility <span className="text-candy">Estimator</span> 🎯
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5b4b6b] font-body leading-relaxed">
            Wondering whether your child qualifies for Playgroup, Nursery, LKG, or UKG? Select their birth month &amp; year below to see instant Karnataka NEP eligibility and fee estimates.
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Inputs (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-teal-900/5 border border-black/5 space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <span className="font-heading font-bold text-[#3a2e4d] text-lg flex items-center gap-2">
                <Calendar size={18} className="text-candy" />
                Child&apos;s Birth Details
              </span>
              <span className="text-xs bg-leaf/20 text-[#2b6118] px-2.5 py-1 rounded-full font-heading font-semibold">
                Cutoff: June 1, 2026
              </span>
            </div>

            {/* Birth Year Selector */}
            <div>
              <label htmlFor="birth-year-select" className="block text-xs font-heading font-semibold uppercase tracking-wider text-[#5b4b6b] mb-2">
                Birth Year
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[2024, 2023, 2022, 2021, 2020].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setBirthYear(yr)}
                    className={`py-2 text-sm font-heading font-bold rounded-xl border transition-all ${
                      birthYear === yr
                        ? "bg-candy text-white border-candy shadow-md shadow-candy/30 scale-[1.02]"
                        : "bg-gray-50 text-[#5b4b6b] border-gray-200 hover:border-candy/40 hover:bg-white"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Birth Month Selector */}
            <div>
              <label htmlFor="birth-month-select" className="block text-xs font-heading font-semibold uppercase tracking-wider text-[#5b4b6b] mb-2">
                Birth Month
              </label>
              <select
                id="birth-month-select"
                aria-label="Select Birth Month"
                value={birthMonth}
                onChange={(e) => setBirthMonth(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-heading font-semibold text-[#3a2e4d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-candy"
              >
                {MONTHS.map((name, idx) => (
                  <option key={name} value={idx}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Daycare Extension Option */}
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-[#5b4b6b] mb-2">
                Optional Daycare Add-on
              </label>
              <div className="space-y-2">
                {DAYCARE_OPTIONS.map((d) => (
                  <label
                    key={d.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      daycareOption === d.id
                        ? "border-candy bg-candy/5 ring-1 ring-candy"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="daycare"
                      value={d.id}
                      checked={daycareOption === d.id}
                      onChange={() => setDaycareOption(d.id)}
                      className="mt-0.5 text-candy focus:ring-candy"
                    />
                    <div className="text-xs">
                      <p className="font-heading font-bold text-[#3a2e4d]">{d.label}</p>
                      <p className="text-[#5b4b6b] mt-0.5">{d.hours}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="pt-2">
              <div className="flex items-center justify-between bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setBillingCycle("quarterly")}
                  className={`flex-1 py-1.5 text-xs font-heading font-bold rounded-lg transition-all ${
                    billingCycle === "quarterly" ? "bg-white text-candy shadow-sm" : "text-[#5b4b6b]"
                  }`}
                >
                  Quarterly Term
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`flex-1 py-1.5 text-xs font-heading font-bold rounded-lg transition-all ${
                    billingCycle === "annual" ? "bg-white text-candy shadow-sm" : "text-[#5b4b6b]"
                  }`}
                >
                  Annual (Save 8%)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Results & Grade Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-teal-900/5 border border-candy/20 flex flex-col justify-between">
            <div>
              {/* Computed Age Pill */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#EAF8FF] px-4 py-3 rounded-2xl border border-sky/30 mb-6">
                <div>
                  <span className="text-xs text-[#5b4b6b] font-heading">Age on June 1, 2026:</span>
                  <p className="font-display text-xl font-bold text-[#3a2e4d]">
                    {ageYears} Years, {ageMonths} Months
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#5b4b6b] font-heading">Karnataka NEP 2020:</span>
                  <p className="text-xs font-heading font-bold text-candy flex items-center gap-1">
                    <CheckCircle2 size={14} /> 100% Eligible
                  </p>
                </div>
              </div>

              {statusMessage && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-body flex items-start gap-2">
                  <HelpCircle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Recommended Grade Banner */}
              <div className="border border-black/5 rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50/50 mb-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`inline-block text-xs font-heading font-bold px-3 py-1 rounded-full border mb-2 ${selectedGrade.badgeBg}`}>
                      {selectedGrade.badge}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#3a2e4d]">
                      {selectedGrade.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#5b4b6b] font-heading">Age Bracket</span>
                    <p className="text-sm font-heading font-bold text-[#3a2e4d]">{selectedGrade.ageRange}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#5b4b6b] font-body mt-2 leading-relaxed">
                  {selectedGrade.description}
                </p>

                {/* Key Program Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-black/5">
                  <div className="flex items-center gap-2 text-xs text-[#3a2e4d] font-heading font-medium">
                    <Clock size={14} className="text-candy shrink-0" />
                    <span>{selectedGrade.timings}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#3a2e4d] font-heading font-medium">
                    <Users size={14} className="text-leaf shrink-0" />
                    <span>{selectedGrade.ratio}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedGrade.highlights.map((h) => (
                    <span key={h} className="text-[11px] bg-white border border-black/5 px-2.5 py-1 rounded-lg text-[#5b4b6b] font-body">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fee Breakdown Box */}
              <div className="bg-[#FFFDF4] border border-sunshine/30 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between text-xs text-[#5b4b6b] mb-1">
                  <span>Preschool Tuition ({billingCycle === "quarterly" ? "Quarterly Term" : "Annual"}):</span>
                  <span className="font-heading font-bold text-[#3a2e4d]">
                    ₹{estimatedTuition.toLocaleString("en-IN")}
                  </span>
                </div>
                {estimatedDaycare > 0 && (
                  <div className="flex items-center justify-between text-xs text-[#5b4b6b] mb-1">
                    <span>Daycare ({selectedDaycare.label}):</span>
                    <span className="font-heading font-bold text-[#3a2e4d]">
                      +₹{estimatedDaycare.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-sunshine/20">
                  <div>
                    <span className="text-xs font-heading font-bold text-[#3a2e4d] uppercase tracking-wide">
                      Estimated Total ({billingCycle})
                    </span>
                    <p className="text-[11px] text-[#5b4b6b]">Includes learning kit, activities &amp; safety access</p>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-2xl sm:text-3xl font-bold text-candy">
                      ₹{totalEstimated.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-[#5b4b6b] block">
                      {billingCycle === "quarterly" ? "/ term" : "/ academic year"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href={`/admissions/apply?program=${selectedGrade.id}`}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-candy text-white font-heading font-bold text-center text-sm shadow-lg shadow-teal-900/10 hover:bg-[#0c5460] transition-all flex items-center justify-center gap-2"
              >
                <span>Enroll for {selectedGrade.name.split(" ")[0]}</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-leaf/20 hover:bg-leaf/30 text-[#204a11] font-heading font-bold text-center text-sm transition-all flex items-center justify-center gap-2 border border-leaf/40"
              >
                <MessageCircle size={16} />
                <span>Verify on WhatsApp</span>
              </a>
            </div>

            <p className="text-[11px] text-[#5b4b6b] text-center mt-3 font-body">
              *Fee estimates are indicative for 2026-27. Final schedule and transport options confirmed during campus tour.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
