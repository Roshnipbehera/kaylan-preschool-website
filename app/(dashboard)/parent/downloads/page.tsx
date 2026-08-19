import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ParentDownloadsContent } from "./ParentDownloadsContent";

export const metadata: Metadata = {
  title: "Downloads | Kaylan Preschool",
  description: "Document center for receipts and school documents.",
};

export default function ParentDownloadsPage() {
  return (
    <DashboardShell>
      <ParentDownloadsContent />
    </DashboardShell>
  );
}
