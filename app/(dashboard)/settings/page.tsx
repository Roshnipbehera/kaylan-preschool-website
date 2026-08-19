import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SettingsContent } from "./SettingsContent";

export const metadata: Metadata = {
  title: "Settings | Kaylan Preschool",
  description: "Manage your notification preferences and account security.",
};

export default function SettingsPage() {
  return (
    <DashboardShell>
      <SettingsContent />
    </DashboardShell>
  );
}
