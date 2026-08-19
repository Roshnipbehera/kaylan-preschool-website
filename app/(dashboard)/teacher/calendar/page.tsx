import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TeacherCalendarContent } from "./TeacherCalendarContent";

export const metadata: Metadata = {
  title: "Calendar | Teacher Dashboard",
  description: "Events, homework due dates and progress-report reminders in one view.",
};

export default function TeacherCalendarPage() {
  return (
    <DashboardShell>
      <TeacherCalendarContent />
    </DashboardShell>
  );
}
