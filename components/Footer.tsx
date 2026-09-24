"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import { usePublicSettings } from "@/lib/hooks/usePublicSettings";
import type { FooterContent } from "@/lib/types/cms";

const SEED: FooterContent = {
  brand: "🌈 Kaylan Preschool",
  tagline: "Electronic City, Bangalore. A magical place where little dreams begin, every single day.",
  newsletterHeading: "Storybook Newsletter",
  newsletterText: "Get magical updates & preschool tips.",
  quickLinks: [
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Curriculum", href: "/curriculum" },
    { label: "Facilities", href: "/facilities" },
    { label: "Admissions", href: "/admissions/apply" },
    { label: "Gallery", href: "/gallery" },
    { label: "Events", href: "/events" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
};

export default function Footer() {
  const { data } = useCmsSection("footer", SEED);
  const { data: settings } = usePublicSettings();
  return (
    <footer id="contact-footer" className="relative overflow-hidden bg-gradient-to-b from-[#FFE9B0] to-[#FFCE7A] pt-20 pb-8">
      <svg aria-hidden className="absolute -top-1 left-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,60 C300,120 1140,0 1440,60 L1440,0 L0,0 Z" fill="white" />
      </svg>

      <motion.div
        aria-hidden
        className="absolute right-10 top-6 w-24 h-24 rounded-full bg-candy shadow-[0_0_60px_20px_rgba(15,107,102,0.45)]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <svg aria-hidden className="absolute bottom-24 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,80 C240,20 480,120 720,60 C960,10 1200,90 1440,50 L1440,150 L0,150 Z" fill="#7ED957" opacity="0.85" />
      </svg>

      <div aria-hidden className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-8 text-4xl">
        <motion.span animate={{ rotate: [0, 15, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>🧒</motion.span>
        <motion.span animate={{ rotate: [0, -15, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>👧</motion.span>
        <motion.span animate={{ rotate: [0, 15, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>🧒</motion.span>
      </div>
      <motion.span aria-hidden className="absolute top-16 left-16 text-2xl" animate={{ x: [0, 40, 0] }} transition={{ duration: 8, repeat: Infinity }}>🐦</motion.span>
      <motion.span aria-hidden className="absolute top-24 right-32 text-2xl" animate={{ x: [0, -30, 0] }} transition={{ duration: 7, repeat: Infinity }}>🐦</motion.span>
      <motion.div
        aria-hidden
        className="absolute top-4 left-8 w-14 h-14 sm:w-16 sm:h-16 animate-floatSlow pointer-events-none hidden sm:block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <Image src="/brand/koki-mascot-final.png" alt="" fill sizes="64px" className="object-contain" />
      </motion.div>

      <div className="relative max-w-6xl mx-auto px-6 mt-40 grid sm:grid-cols-3 gap-10 text-[#4a3b1a]">
        <div>
          <h3 className="font-display text-2xl font-bold mb-2">{data.brand}</h3>
          <p className="text-sm">{data.tagline}</p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-80 transition-opacity">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center gap-1.5 text-xs font-heading font-bold bg-white/70 hover:bg-white text-[#d62976] px-3 py-1 rounded-full shadow-sm transition-all"
              >
                <Instagram className="w-4 h-4" />
                <span>@kaylanpreschoolanddaycare</span>
              </a>
            )}
            {settings.twitterUrl && (
              <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:opacity-80 transition-opacity">
                <Youtube className="w-5 h-5" />
              </a>
            )}
          </div>
          <div className="mt-4 text-xs space-y-1 text-[#5b4720]">
            <p>📞 <a href={`tel:${settings.contactPhone?.replace(/[^+\d]/g, "")}`} className="hover:underline font-semibold">{settings.contactPhone}</a></p>
            <p>✉️ <a href={`mailto:${settings.contactEmail}`} className="hover:underline font-semibold">{settings.contactEmail}</a></p>
            <p className="line-clamp-2 leading-relaxed">📍 {settings.address}</p>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-2">Quick Links</h4>
          <ul className="text-sm space-y-1">
            {data.quickLinks.map((l) => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-2">{data.newsletterHeading}</h4>
          <p className="text-sm mb-3">{data.newsletterText}</p>
          <form className="flex gap-2">
            <input type="email" placeholder="Parent email" className="flex-1 min-w-0 rounded-full px-4 py-2 text-sm text-[#3a2e4d]" />
            <button className="bg-white rounded-full px-4 py-2 text-sm font-semibold">Join</button>
          </form>
        </div>
      </div>
      <p className="relative text-center text-xs mt-10 text-[#5b4720]">
        © {new Date().getFullYear()} Kaylan Preschool · All rights reserved · Made with 💛 by <span className="font-heading font-bold text-[#3a2e4d]">Roshni</span>
      </p>
    </footer>
  );
}
