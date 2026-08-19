import Link from "next/link";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { Button } from "@/components/ui/Button";
import { AdminAnalyticsContent } from "./AdminAnalyticsContent";

export const metadata: Metadata = {
  title: "Admin Dashboard | Kaylan Preschool",
  description: "Manage enrollment, staff, content, fees, and school-wide settings.",
};

export default function AdminDashboardPage() {
  return (
    <DashboardShell>
      <AdminSubNav />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link href="/admin/cms">
          <Button variant="primary">Manage Site Content</Button>
        </Link>
        <Link href="/admin/admissions">
          <Button variant="secondary">Review Admissions</Button>
        </Link>
        <Link href="/admin/students">
          <Button variant="outline">Manage Students</Button>
        </Link>
        <Link href="/admin/fees">
          <Button variant="outline">Manage Fees</Button>
        </Link>
        <Link href="/admin/analytics">
          <Button variant="outline">Full Analytics</Button>
        </Link>
      </div>
      <AdminAnalyticsContent compact />
    </DashboardShell>
  );
}
