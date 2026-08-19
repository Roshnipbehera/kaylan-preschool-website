import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TeacherEventsContent } from "./TeacherEventsContent";

export const metadata: Metadata = {
  title: "Events | Teacher Dashboard",
  description: "Upcoming school events and RSVP visibility.",
};

export default function TeacherEventsPage() {
  return (
    <DashboardShell>
      <TeacherEventsContent />
    </DashboardShell>
  );
}
