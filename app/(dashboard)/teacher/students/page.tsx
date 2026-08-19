import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TeacherStudentsContent } from "./TeacherStudentsContent";

export const metadata: Metadata = {
  title: "My Students | Teacher Dashboard",
  description: "Students in your class(es).",
};

export default function TeacherStudentsPage() {
  return (
    <DashboardShell>
      <TeacherStudentsContent />
    </DashboardShell>
  );
}
