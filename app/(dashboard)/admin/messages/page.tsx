import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminMessagesContent } from "./AdminMessagesContent";

export const metadata: Metadata = {
  title: "Messages | Kaylan Preschool Admin",
  description: "Message teachers and parents directly.",
};

export default function AdminMessagesPage() {
  return (
    <DashboardShell>
      <AdminMessagesContent />
    </DashboardShell>
  );
}
