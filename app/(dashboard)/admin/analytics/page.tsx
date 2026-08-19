import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { AdminAnalyticsContent } from "../AdminAnalyticsContent";

export const metadata: Metadata = {
  title: "Analytics | Kaylan Preschool Admin",
  description: "School-wide analytics across enrollment, attendance, and fees.",
};

export default function AdminAnalyticsPage() {
  return (
    <DashboardShell>
      <AdminSubNav />
      <h1 className="mb-6 font-display text-2xl font-bold text-[#3a2e4d]">Analytics</h1>
      <AdminAnalyticsContent />
    </DashboardShell>
  );
}
