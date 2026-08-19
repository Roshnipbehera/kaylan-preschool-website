import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = {
  title: "My Profile | Kaylan Preschool",
  description: "View and edit your Kaylan Preschool account profile.",
};

export default function ProfilePage() {
  return (
    <DashboardShell>
      <ProfileForm />
    </DashboardShell>
  );
}
