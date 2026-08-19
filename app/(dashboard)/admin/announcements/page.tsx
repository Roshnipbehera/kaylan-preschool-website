import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminAnnouncementsContent } from "./AdminAnnouncementsContent";

export const metadata: Metadata = {
  title: "Announcements | Kaylan Preschool Admin",
  description: "Post and review school-wide announcements.",
};

export default function AdminAnnouncementsPage() {
  return (
    <DashboardShell>
      <AdminAnnouncementsContent />
    </DashboardShell>
  );
}
