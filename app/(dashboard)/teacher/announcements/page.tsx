import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TeacherAnnouncementsContent } from "./TeacherAnnouncementsContent";

export const metadata: Metadata = {
  title: "Announcements | Teacher Dashboard",
  description: "Post class-scoped announcements to parents.",
};

export default function TeacherAnnouncementsPage() {
  return (
    <DashboardShell>
      <TeacherAnnouncementsContent />
    </DashboardShell>
  );
}
