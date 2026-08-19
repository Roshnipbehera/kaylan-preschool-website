import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ParentMessagesContent } from "./ParentMessagesContent";

export const metadata: Metadata = {
  title: "Messages | Kaylan Preschool",
  description: "Message your child's teacher directly.",
};

export default function ParentMessagesPage() {
  return (
    <DashboardShell>
      <ParentMessagesContent />
    </DashboardShell>
  );
}
