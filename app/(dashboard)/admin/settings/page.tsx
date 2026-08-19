import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { AdminSettingsContent } from "./AdminSettingsContent";

export const metadata: Metadata = {
  title: "Settings | Kaylan Preschool Admin",
  description: "Manage school-wide system settings.",
};

export default function AdminSettingsPage() {
  return (
    <DashboardShell>
      <AdminSubNav />
      <AdminSettingsContent />
    </DashboardShell>
  );
}
