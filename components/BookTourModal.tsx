"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageCircle,
  Navigation,
} from "lucide-react";
import Image from "next/image";
import { usePublicSettings } from "@/lib/hooks/usePublicSettings";
import { createContactInquiry } from "@/lib/api/contact";

interface BookTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
}

const TIME_SLOTS = [
  "10:00 AM – 11:00 AM (Morning Circle & Activity Time)",
  "11:30 AM – 12:30 PM (Montessori Lab & Snack Time)",
  "3:30 PM – 4:30 PM (Afternoon Play & Daycare Explorer)",
  "5:00 PM – 6:00 PM (Working Parents Evening Walkthrough)",
];

const PROGRAMS = [
  "Playgroup L0 (2 – 3 Yrs)",
  "Nursery L1 (3 – 4 Yrs)",
  "Junior KG L3 (4 – 5 Yrs)",
  "Senior KG L4 (5 – 6 Yrs)",
  "Daycare (Ages 1 – 10 Yrs · Till 6:30 PM)",
  "After-School Program (Ages 4 – 10 Yrs)",
];

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Kaylan+Preschool/@12.8476538,77.6398347,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae6b9b672e8d85:0xd95610aa3ce6c9e2!8m2!3d12.8476486!4d77.6424096!16s%2Fg%2F11vk7cj610";
const GOOGLE_MAPS_DIRECTIONS = "https://www.google.com/maps/dir/?api=1&destination=12.8476486,77.6424096&destination_place_id=ChIJhY0uZ55rrjsR4s7mPqoQVtk";

export default function BookTourModal({ isOpen, onClose, defaultProgram }: BookTourModalProps) {
  const { data } = usePublicSettings();
  const rawPhone = data?.contactPhone || "+91 96636 30221";
  const phoneDigits = rawPhone.replace(/[^\d]/g, "") || "919663630221";

  const [mounted, setMounted] = useState(false);
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [selectedProgram, setSelectedProgram] = useState(defaultProgram || PROGRAMS[1]);
  const [visitDay, setVisitDay] = useState("Upcoming Saturday Open House");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Save lead to database in background
    createContactInquiry({
      parentName: parentName || "Campus Walkthrough Parent",
      phone: parentPhone || "9663630221",
      message: `Campus Tour Request: Program: ${selectedProgram} | Day: ${visitDay} | Slot: ${selectedSlot}`,
    }).catch(() => {});

    const text = `Hello Kaylan Preschool! I would like to confirm my Campus Tour.\n\n👤 Parent: ${parentName || "Parent"}\n📱 Phone: ${parentPhone || "Not provided"}\n🗓️ Day: ${visitDay}\n⏰ Time: ${selectedSlot.split(" ")[0]} ${selectedSlot.split(" ")[1]}\n🎒 Program: ${selectedProgram}\n\nPlease confirm our appointment and send entrance gate guidance.`;
    const waUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`;

    // Open WhatsApp in new tab
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-candy/20 my-8 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {!submitted ? (
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-candy/10 text-candy flex items-center justify-center shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <span className="text-[11px] font-heading font-bold text-candy uppercase tracking-wider">
                      Admissions 2026-27
                    </span>
                    <h3 className="font-display text-2xl font-bold text-[#3a2e4d]">
                      Book a Campus Walkthrough 🏫
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#5b4b6b] font-body mb-6">
                  Visit our child-safe Electronic City campus, meet our certified Montessori mentors, and experience our vibrant learning environments in person.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-heading font-semibold text-[#3a2e4d] mb-1">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-[#3a2e4d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-candy"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-[#3a2e4d] mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 96636 30221"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-[#3a2e4d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-candy"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-heading font-semibold text-[#3a2e4d] mb-1">
                        Preferred Visit Day
                      </label>
                      <select
                        value={visitDay}
                        onChange={(e) => setVisitDay(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-heading font-semibold text-[#3a2e4d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-candy"
                      >
                        <option value="Upcoming Saturday Open House">Upcoming Saturday Open House</option>
                        <option value="This Weekday Morning (Mon-Fri)">This Weekday Morning (Mon-Fri)</option>
                        <option value="This Weekday Afternoon">This Weekday Afternoon</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-heading font-semibold text-[#3a2e4d] mb-1">
                        Program of Interest
                      </label>
                      <select
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-heading font-semibold text-[#3a2e4d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-candy"
                      >
                        {PROGRAMS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-[#3a2e4d] mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-body text-[#3a2e4d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-candy"
                    >
                      {TIME_SLOTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Campus Location Reminder */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-[#5b4b6b] flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-heading">
                      <MapPin size={13} className="text-candy" />
                      Bettadasanapura, Electronic City Phase 1
                    </span>
                    <a
                      href={GOOGLE_MAPS_DIRECTIONS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-candy font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span>GPS Pin</span>
                      <Navigation size={11} />
                    </a>
                  </div>

                  {/* Submit Action */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-full bg-candy hover:bg-[#0c5460] text-white font-heading font-bold text-sm shadow-lg shadow-teal-900/10 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    <span>Confirm Walkthrough on WhatsApp</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-leaf/20 text-leaf flex items-center justify-center mx-auto mb-4 border-2 border-leaf">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="font-display text-2xl font-bold text-[#3a2e4d]">
                  Tour Request Sent! 🎉
                </h4>
                <p className="text-xs text-[#5b4b6b] font-body mt-2 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-bold text-[#3a2e4d]">{parentName}</span>! Our admission coordinator will welcome you on <span className="font-bold">{visitDay}</span> at <span className="font-bold">{selectedSlot.split(" ")[0]} {selectedSlot.split(" ")[1]}</span>.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={GOOGLE_MAPS_DIRECTIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-5 rounded-full bg-leaf text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <Navigation size={14} />
                    <span>Open Driving Directions</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      onClose();
                    }}
                    className="py-2.5 px-5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#3a2e4d] font-heading font-semibold text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
