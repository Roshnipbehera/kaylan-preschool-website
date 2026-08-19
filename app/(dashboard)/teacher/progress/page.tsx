import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TeacherProgressContent } from "./TeacherProgressContent";

export const metadata: Metadata = {
  title: "Progress Reports | Teacher Dashboard",
  description: "Write periodic progress notes for your students.",
};

export default function TeacherProgressPage() {
  return (
    <DashboardShell>
      <TeacherProgressContent />
    </DashboardShell>
  );
}
