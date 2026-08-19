import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminAdmissionsContent } from "./AdminAdmissionsContent";

export const metadata: Metadata = {
  title: "Admissions | Kaylan Preschool Admin",
  description: "Review and manage admission applications.",
};

export default function AdminAdmissionsPage() {
  return (
    <DashboardShell>
      <AdminAdmissionsContent />
    </DashboardShell>
  );
}
