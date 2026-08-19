"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/lib/hooks/usePermissions";
import type { PermissionKey } from "@/lib/types/roles";

interface NavLink {
  href: string;
  label: string;
  permission?: PermissionKey;
}

const LINKS: NavLink[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/analytics", label: "Analytics", permission: "view_analytics" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/admissions", label: "Admissions" },
  { href: "/admin/teachers", label: "Teachers", permission: "manage_users" },
  { href: "/admin/parents", label: "Parents", permission: "manage_users" },
  { href: "/admin/students", label: "Students", permission: "manage_students" },
  { href: "/admin/cms", label: "CMS", permission: "manage_cms" },
  { href: "/admin/gallery", label: "Gallery", permission: "manage_gallery" },
  { href: "/admin/cms/programs", label: "Programs" },
  { href: "/admin/blog", label: "Blogs", permission: "publish_blog" },
  { href: "/admin/events", label: "Events", permission: "manage_events" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/fees", label: "Fees", permission: "manage_fees" },
  { href: "/admin/cms/testimonials", label: "Testimonials" },
  { href: "/admin/roles", label: "Roles & Permissions", permission: "manage_roles" },
  { href: "/admin/audit-logs", label: "Audit Logs", permission: "view_audit_logs" },
  { href: "/admin/settings", label: "Settings", permission: "manage_settings" },
];

export function AdminSubNav() {
  const pathname = usePathname();
  const { can, isLoading } = usePermissions();

  const visibleLinks = LINKS.filter((link) => !link.permission || isLoading || can(link.permission));

  return (
    <nav className="mb-6 flex flex-wrap gap-2 overflow-x-auto pb-1">
      {visibleLinks.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(link.href);
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
