"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/parent", label: "Overview" },
  { href: "/parent/child", label: "Child Profile" },
  { href: "/parent/attendance", label: "Attendance" },
  { href: "/parent/homework", label: "Homework" },
  { href: "/parent/activities", label: "Activities" },
  { href: "/parent/messages", label: "Messages" },
  { href: "/parent/calendar", label: "Calendar" },
  { href: "/parent/gallery", label: "Gallery" },
  { href: "/parent/fees", label: "Fees" },
  { href: "/parent/announcements", label: "Announcements" },
  { href: "/parent/downloads", label: "Downloads" },
  { href: "/parent/admissions", label: "Admissions" },
  { href: "/settings", label: "Settings" },
];

export function ParentSubNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-2 overflow-x-auto pb-1">
      {LINKS.map((link) => {
        const active = link.href === "/parent" ? pathname === "/parent" : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 font-heading text-sm font-semibold transition-colors",
              active ? "bg-candy text-white shadow-sm" : "bg-white text-[#3a2e4d]/70 hover:bg-candy/10 hover:text-candy border border-black/5"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
