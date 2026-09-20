"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X } from "lucide-react";
import { usePublicSettings } from "@/lib/hooks/usePublicSettings";

export default function FloatingButtons() {
  const { data } = usePublicSettings();
  const [showPill, setShowPill] = useState(true);
  const rawPhone = data?.contactPhone || "+91 98860 12345";
  const phoneDigits = rawPhone.replace(/[^\d]/g, "") || "919886012345";
  const telHref = `tel:${rawPhone.replace(/[^+\d]/g, "") || "+919886012345"}`;
  const waHref = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
    "Hello Kaylan Preschool! I would like to enquire about admission and book a tour."
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-end gap-3 pointer-events-none">
      {/* Floating Prompt on Desktop/Tablet */}
      <AnimatePresence>
        {showPill && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-leaf/30 text-xs font-heading font-semibold text-[#3a2e4d] pointer-events-auto"
          >
            <span className="w-2 h-2 rounded-full bg-leaf animate-ping" />
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="hover:text-candy transition-colors">
              Admissions Open 2026-27 · <span className="text-leaf font-bold">Chat with us!</span>
            </a>
            <button
              onClick={() => setShowPill(false)}
              className="ml-1 text-gray-400 hover:text-gray-600"
              aria-label="Dismiss message"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="flex flex-col gap-3 pointer-events-auto">
        <motion.a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-14 h-14 rounded-full bg-leaf text-white flex items-center justify-center shadow-xl hover:shadow-leaf/40 border-2 border-white"
          whileHover={{ scale: 1.12, rotate: -6 }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ y: { duration: 2.2, repeat: Infinity } }}
        >
          <MessageCircle size={26} className="text-[#3a2e4d]" />
        </motion.a>
        <motion.a
          href={telHref}
          aria-label="Call Kaylan Preschool"
          className="w-14 h-14 rounded-full bg-candy text-white flex items-center justify-center shadow-xl hover:shadow-candy/40 border-2 border-white"
          whileHover={{ scale: 1.12, rotate: 6 }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ y: { duration: 2.4, repeat: Infinity, delay: 0.4 } }}
        >
          <Phone size={24} />
        </motion.a>
      </div>
    </div>
  );
}
