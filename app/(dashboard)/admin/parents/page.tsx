import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { AdminParentsContent } from "./AdminParentsContent";

export const metadata: Metadata = {
  title: "Parents | Kaylan Preschool Admin",
  description: "Manage parent accounts and their linked children.",
};

export default function AdminParentsPage() {
  return (
    <DashboardShell>
      <AdminSubNav />
      <AdminParentsContent />
    </DashboardShell>
  );
}
