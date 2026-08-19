import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ParentHomeworkContent } from "./ParentHomeworkContent";

export const metadata: Metadata = {
  title: "Homework | Kaylan Preschool",
  description: "View homework assigned to your child's class.",
};

export default function ParentHomeworkPage() {
  return (
    <DashboardShell>
      <ParentHomeworkContent />
    </DashboardShell>
  );
}
