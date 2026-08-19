import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TeacherMessagesContent } from "./TeacherMessagesContent";

export const metadata: Metadata = {
  title: "Messages | Teacher Dashboard",
  description: "Message parents of the students in your class.",
};

export default function TeacherMessagesPage() {
  return (
    <DashboardShell>
      <TeacherMessagesContent />
    </DashboardShell>
  );
}
