import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TeacherDashboardContent } from "./TeacherDashboardContent";

export const metadata: Metadata = {
  title: "Teacher Dashboard | Kaylan Preschool",
  description: "Manage your classroom, attendance, and upcoming activities.",
};

export default function TeacherDashboardPage() {
  return (
    <DashboardShell>
      <TeacherDashboardContent />
    </DashboardShell>
  );
}
