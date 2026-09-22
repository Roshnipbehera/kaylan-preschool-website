"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { NavigationContent } from "@/lib/types/cms";

const SEED: NavigationContent = {
  brand: "🌈 Kaylan Preschool",
  links: ["Home", "About Us", "Programs", "Curriculum", "Facilities", "Gallery", "Events", "Admissions", "Blog", "Careers", "Contact"],
  ctaLabel: "Enquire Now",
  ctaHref: "#admissions",
};

const ROUTE_LINKS: Record<string, string> = {
  Home: "/",
  "About Us": "/about",
  Programs: "/programs",
  Curriculum: "/curriculum",
  Facilities: "/facilities",
  Gallery: "/gallery",
  Events: "/events",
  Admissions: "/admissions/apply",
  Blog: "/blog",
  Careers: "/careers",
  Contact: "/contact",
};

function hrefFor(label: string) {
  return ROUTE_LINKS[label] ?? `/${label.toLowerCase().replace(/\s+/g, "-")}`;
}

export default function Navbar() {
  const { data } = useCmsSection("navigation", SEED);
  const [open, setOpen] = useState(false);
  const ctaLink = data.ctaHref.startsWith("#") ? "/contact" : data.ctaHref;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">
        <a href="/" className="flex items-center gap-2.5 font-display text-2xl font-bold text-candy group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-candy/30 bg-sunshine/20">
            <Image
              src="/brand/koki-mascot-final.png"
              alt="Kaylan Preschool Logo Mascot"
              fill
              sizes="32px"
              className="object-contain p-0.5 group-hover:scale-110 transition-transform"
            />
          </div>
          <span>{data.brand.replace(/^[^\w\s]+\s*/, "") || data.brand}</span>
        </a>
        <ul className="hidden xl:flex gap-5 text-sm font-heading font-medium text-[#5b4b6b]">
          {data.links.map((l) => (
            <li key={l}>
              <a href={hrefFor(l)} className="hover:text-candy transition-colors">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden md:flex items-center gap-4">
          <a href="/login" className="text-sm font-heading font-semibold text-[#5b4b6b] hover:text-candy transition-colors">Login</a>
          <motion.a
            href={ctaLink}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="inline-block bg-sunshine text-[#4a3b00] font-heading font-semibold px-5 py-2.5 rounded-full shadow-md"
          >
            {data.ctaLabel}
          </motion.a>
        </div>
        <button className="xl:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden overflow-hidden bg-white px-5 pb-5 font-heading shadow-lg"
          >
            <ul className="flex flex-col gap-3 pt-2">
              {data.links.map((l) => (
                <li key={l}>
                  <a href={hrefFor(l)} onClick={() => setOpen(false)} className="block py-1 text-[#5b4b6b] hover:text-candy">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-black/5 flex flex-col gap-2.5 mt-3">
              <a
                href="/login"
                onClick={() => setOpen(false)}
                className="text-center py-2.5 text-sm font-heading font-semibold text-[#5b4b6b] hover:text-candy transition-colors bg-gray-50 rounded-full"
              >
                Parent / Teacher Login
              </a>
              <a
                href={ctaLink}
                onClick={() => setOpen(false)}
                className="text-center py-2.5 bg-candy text-white font-heading font-bold text-sm rounded-full shadow"
              >
                {data.ctaLabel}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}