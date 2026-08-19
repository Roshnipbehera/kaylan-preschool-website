import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ParentAnnouncementsContent } from "./ParentAnnouncementsContent";

export const metadata: Metadata = {
  title: "Announcements | Kaylan Preschool",
  description: "Latest announcements from Kaylan Preschool.",
};

export default function ParentAnnouncementsPage() {
  return (
    <DashboardShell>
      <ParentAnnouncementsContent />
    </DashboardShell>
  );
}
