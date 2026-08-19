import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { AdminTeachersContent } from "./AdminTeachersContent";

export const metadata: Metadata = {
  title: "Teachers | Kaylan Preschool Admin",
  description: "Manage teacher accounts and class assignments.",
};

export default function AdminTeachersPage() {
  return (
    <DashboardShell>
      <AdminSubNav />
      <AdminTeachersContent />
    </DashboardShell>
  );
}
