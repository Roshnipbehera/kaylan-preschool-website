import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { AdminStudentsContent } from "./AdminStudentsContent";

export const metadata: Metadata = {
  title: "Students | Kaylan Preschool Admin",
  description: "Manage student records, class and teacher assignment.",
};

export default function AdminStudentsPage() {
  return (
    <DashboardShell>
      <AdminSubNav />
      <AdminStudentsContent />
    </DashboardShell>
  );
}
