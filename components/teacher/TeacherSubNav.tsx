"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/teacher", label: "Overview" },
  { href: "/teacher/students", label: "Students" },
  { href: "/teacher/attendance", label: "Attendance" },
  { href: "/teacher/assignments", label: "Assignments" },
  { href: "/teacher/progress", label: "Progress Reports" },
  { href: "/teacher/activities", label: "Activities" },
  { href: "/teacher/messages", label: "Messages" },
  { href: "/teacher/announcements", label: "Announcements" },
  { href: "/teacher/events", label: "Events" },
  { href: "/teacher/calendar", label: "Calendar" },
  { href: "/settings", label: "Settings" },
];

export function TeacherSubNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-2 overflow-x-auto pb-1">
      {LINKS.map((link) => {
        const active = link.href === "/teacher" ? pathname === "/teacher" : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 font-heading text-sm font-semibold transition-colors",
              active ? "bg-sky text-[#3a2e4d] shadow-sm" : "bg-white text-[#3a2e4d]/70 hover:bg-sky/10 hover:text-sky border border-black/5"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
