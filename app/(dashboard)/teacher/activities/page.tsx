import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TeacherActivitiesContent } from "./TeacherActivitiesContent";

export const metadata: Metadata = {
  title: "Daily Activities | Teacher Dashboard",
  description: "Log daily activities for your students with photo/video attachments.",
};

export default function TeacherActivitiesPage() {
  return (
    <DashboardShell>
      <TeacherActivitiesContent />
    </DashboardShell>
  );
}
