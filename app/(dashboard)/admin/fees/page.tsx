import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { AdminFeesContent } from "./AdminFeesContent";

export const metadata: Metadata = {
  title: "Fees | Kaylan Preschool Admin",
  description: "Manage invoices and payment collection across all students.",
};

export default function AdminFeesPage() {
  return (
    <DashboardShell>
      <AdminSubNav />
      <AdminFeesContent />
    </DashboardShell>
  );
}
