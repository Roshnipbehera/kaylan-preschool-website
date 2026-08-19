"use client";

// Client-side countdown to the soonest upcoming event, refreshed every
// second via setInterval. Uses Framer Motion's AnimatePresence keyed on the
// digit value for a flip/fade transition, matching the site's existing
// animation language (see components/Hero.tsx-style whileInView/whileHover
// motion usage elsewhere in the app).
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SchoolEvent } from "@/lib/types/events";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/15 sm:h-20 sm:w-20">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute font-display text-2xl font-bold text-white sm:text-3xl"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-xs font-heading uppercase tracking-wide text-white/80">{label}</span>
    </div>
  );
}

export function EventCountdown({ events }: { events: SchoolEvent[] }) {
  const nextEvent = events
    .filter((e) => new Date(e.date).getTime() > Date.now())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    nextEvent ? getTimeLeft(new Date(nextEvent.date)) : { days: 0, hours: 0, minutes: 0, seconds: 0 },
  );

  useEffect(() => {
    if (!nextEvent) return;
    const target = new Date(nextEvent.date);
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [nextEvent]);

  if (!nextEvent) return null;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-candy to-lavender p-6 text-center shadow-lg sm:p-8">
      <p className="mb-1 font-heading text-sm font-semibold uppercase tracking-wide text-white/80">Up Next</p>
      <h3 className="mb-6 font-display text-2xl font-bold text-white sm:text-3xl">{nextEvent.title}</h3>
      <div className="flex justify-center gap-3 sm:gap-5">
        <Digit value={timeLeft.days} label="Days" />
        <Digit value={timeLeft.hours} label="Hours" />
        <Digit value={timeLeft.minutes} label="Mins" />
        <Digit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
}
