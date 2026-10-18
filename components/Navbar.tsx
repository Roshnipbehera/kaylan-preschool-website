"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BookTourModal from "./BookTourModal";

const PRIMARY_NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Facilities", href: "/facilities" },
  { label: "Gallery", href: "/gallery" },
  { label: "Admissions", href: "/admissions/apply" },
  { label: "Contact", href: "/contact" },
];

const MORE_NAV = [
  { label: "Events", href: "/events", desc: "Open houses, festivals & gatherings" },
  { label: "Blog", href: "/blog", desc: "Parenting tips & early education" },
  { label: "Careers", href: "/careers", desc: "Join our team of loving educators" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5">
      <BookTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5">
        {/* Official Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative h-11 sm:h-12 w-auto shrink-0 flex items-center">
            <Image
              src="/brand/kaylan-logo.png"
              alt="Kaylan Preschool & Daycare"
              width={145}
              height={55}
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </div>
        </Link>

        {/* Desktop Primary Navigation */}
        <ul className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-heading font-medium text-[#5b4b6b]">
          {PRIMARY_NAV.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="hover:text-candy transition-colors py-1 inline-block"
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* More Dropdown */}
          <li
            ref={moreRef}
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1 hover:text-candy transition-colors py-1 focus:outline-none"
              aria-expanded={moreOpen}
            >
              <span>More</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full right-0 w-60 mt-1 bg-white rounded-2xl shadow-xl border border-black/10 p-2 z-50 overflow-hidden"
                >
                  {MORE_NAV.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setMoreOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl hover:bg-lavender/15 transition-colors group/sub"
                    >
                      <p className="font-heading font-bold text-xs text-[#3a2e4d] group-hover/sub:text-candy">
                        {sub.label}
                      </p>
                      <p className="text-[11px] text-[#8a7a9a] leading-tight mt-0.5">
                        {sub.desc}
                      </p>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Desktop CTA Action Group */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-heading font-semibold text-[#5b4b6b] hover:text-candy transition-colors px-2 py-1.5"
          >
            Login
          </Link>
          <motion.button
            type="button"
            onClick={() => setTourOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-candy text-white font-heading font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-md hover:shadow-candy/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>🏫</span>
            <span>Book a Tour</span>
          </motion.button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="lg:hidden p-2 text-[#3a2e4d] hover:text-candy transition-colors rounded-xl focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white border-t border-black/5 px-6 pb-6 pt-3 font-heading shadow-xl"
          >
            <ul className="flex flex-col gap-2.5">
              {PRIMARY_NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-1.5 text-sm font-semibold text-[#5b4b6b] hover:text-candy transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li className="pt-2 border-t border-gray-100">
                <span className="text-[11px] font-bold text-[#8a7a9a] uppercase tracking-wider block mb-1">
                  More Pages
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {MORE_NAV.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-xs font-semibold text-[#5b4b6b] hover:text-candy py-1"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </li>
            </ul>

            <div className="pt-4 border-t border-black/5 flex flex-col gap-2.5 mt-4">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setTourOpen(true);
                }}
                className="w-full text-center py-3 text-sm font-heading font-bold text-white bg-candy hover:bg-candy/90 rounded-full shadow transition-all cursor-pointer"
              >
                🏫 Book a Campus Tour
              </button>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 text-sm font-heading font-semibold text-[#5b4b6b] hover:text-candy bg-gray-50 rounded-full transition-colors"
              >
                Parent / Teacher Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}