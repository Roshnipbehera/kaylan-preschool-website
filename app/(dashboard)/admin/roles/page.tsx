import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { AdminRolesContent } from "./AdminRolesContent";

export const metadata: Metadata = {
  title: "Roles & Permissions | Kaylan Preschool Admin",
  description: "Manage what each role is permitted to access.",
};

export default function AdminRolesPage() {
  return (
    <DashboardShell>
      <AdminSubNav />
      <AdminRolesContent />
    </DashboardShell>
  );
}
