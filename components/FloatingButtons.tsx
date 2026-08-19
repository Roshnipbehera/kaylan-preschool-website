"use client";
import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <motion.a
        href="https://wa.me/910000000000"
        target="_blank"
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
        href="tel:+910000000000"
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
