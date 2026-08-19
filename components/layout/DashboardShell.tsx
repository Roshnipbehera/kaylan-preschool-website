"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut, Menu, User as UserIcon, Settings, Home, X } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useModal } from "@/lib/hooks/useModal";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/layout/NotificationBell";

const NAV_LABELS: Record<string, string> = {
  parent: "Parent Dashboard",
  teacher: "Teacher Dashboard",
  admin: "Admin Dashboard",
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, role, logout } = useAuth();
  const { openModal, closeModal } = useModal();
  const [menuOpen, setMenuOpen] = useState(false);

  const confirmLogout = () => {
    openModal({
      title: "Log out?",
      content: (
        <div>
          <p className="mb-6 text-sm text-[#3a2e4d]/70">Are you sure you want to log out of your Kaylan Preschool account?</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                closeModal();
                logout();
              }}
            >
              Log out
            </Button>
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="min-h-screen bg-[#faf9ff]">
      <header className="flex items-center justify-between border-b border-black/5 bg-white px-4 py-4 sm:px-8">
        <Link href="/" className="font-display text-xl font-bold text-[#3a2e4d]">
          Kaylan Preschool
        </Link>
        <button
          className="sm:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className="hidden items-center gap-4 sm:flex">
          {(role === "parent" || role === "teacher") && <NotificationBell />}
          <Link href="/profile" className="flex items-center gap-1.5 text-sm font-heading text-[#3a2e4d] hover:text-candy">
            <UserIcon size={16} /> Profile
          </Link>
          <Link href="/settings" className="flex items-center gap-1.5 text-sm font-heading text-[#3a2e4d] hover:text-candy">
            <Settings size={16} /> Settings
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm font-heading text-[#3a2e4d] hover:text-candy">
            <Home size={16} /> Site
          </Link>
          <Button variant="outline" size="sm" onClick={confirmLogout}>
            <LogOut size={16} /> Log out
          </Button>
        </nav>
      </header>

      {menuOpen && (
        <nav className="flex flex-col gap-3 border-b border-black/5 bg-white px-4 py-4 sm:hidden">
          {(role === "parent" || role === "teacher") && <NotificationBell />}
          <Link href="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
          <Link href="/settings" onClick={() => setMenuOpen(false)}>Settings</Link>
          <Link href="/" onClick={() => setMenuOpen(false)}>Back to site</Link>
          <Button variant="outline" size="sm" onClick={confirmLogout}>
            <LogOut size={16} /> Log out
          </Button>
        </nav>
      )}

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <h1 className="mb-6 font-heading text-2xl font-bold text-[#3a2e4d]">
          {role ? NAV_LABELS[role] : "Dashboard"} {user ? `— Welcome, ${user.name}` : ""}
        </h1>
        {children}
      </div>
    </div>
  );
}
