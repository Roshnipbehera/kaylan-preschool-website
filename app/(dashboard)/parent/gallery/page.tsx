import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ParentGalleryContent } from "./ParentGalleryContent";

export const metadata: Metadata = {
  title: "Gallery | Kaylan Preschool",
  description: "Browse photos and videos from school albums.",
};

export default function ParentGalleryPage() {
  return (
    <DashboardShell>
      <ParentGalleryContent />
    </DashboardShell>
  );
}
