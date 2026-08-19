"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useCmsSection } from "@/lib/hooks/useCmsSection";
import type { NavigationContent } from "@/lib/types/cms";

const SEED: NavigationContent = {
  brand: "🌈 Kaylan Preschool",
  links: ["Home", "About Us", "Programs", "Curriculum", "Facilities", "Gallery", "Events", "Admissions", "Blog", "Careers", "Contact"],
  ctaLabel: "Enquire Now",
  ctaHref: "#admissions",
};

const ROUTE_LINKS: Record<string, string> = {
  Blog: "/blog",
  Gallery: "/gallery",
  Events: "/events",
};

function hrefFor(label: string) {
  return ROUTE_LINKS[label] ?? `#${label.toLowerCase().replace(/\s+/g, "-")}`;
}

export default function Navbar() {
  const { data } = useCmsSection("navigation", SEED);
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">
        <a href="#home" className="flex items-center gap-2 font-display text-2xl font-bold text-candy">
          <span aria-hidden>{data.brand.split(" ")[0]}</span> {data.brand.split(" ").slice(1).join(" ")}
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
            href={data.ctaHref}
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
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden overflow-hidden bg-white px-5 pb-4 flex flex-col gap-3 font-heading"
          >
            {data.links.map((l) => (
              <li key={l}>
                <a href={hrefFor(l)} onClick={() => setOpen(false)}>
                  {l}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}