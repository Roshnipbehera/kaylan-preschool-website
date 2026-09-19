"use client";
import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { usePublicSettings } from "@/lib/hooks/usePublicSettings";

export default function FloatingButtons() {
  const { data } = usePublicSettings();
  const rawPhone = data?.contactPhone || "+91 98860 12345";
  const phoneDigits = rawPhone.replace(/[^\d]/g, "") || "919886012345";
  const telHref = `tel:${rawPhone.replace(/[^+\d]/g, "") || "+919886012345"}`;
  const waHref = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
    "Hello Kaylan Preschool! I would like to enquire about admission and book a tour."
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <motion.a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 rounded-full bg-leaf text-[#3a2e4d] flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.12, rotate: -6 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 2.2, repeat: Infinity } }}
      >
        <MessageCircle size={26} />
      </motion.a>
      <motion.a
        href={telHref}
        aria-label="Call Kaylan Preschool"
        className="w-14 h-14 rounded-full bg-candy text-white flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.12, rotate: 6 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 2.4, repeat: Infinity, delay: 0.4 } }}
      >
        <Phone size={24} />
      </motion.a>
    </div>
  );
}
