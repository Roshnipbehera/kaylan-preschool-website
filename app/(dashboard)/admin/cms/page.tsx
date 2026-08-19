import Link from "next/link";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { CMS_SECTIONS } from "@/lib/types/cms";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Content Manager | Kaylan Preschool Admin",
  description: "Edit every section of the public marketing site without touching code.",
};

export default function CmsIndexPage() {
  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Content Manager</h1>
        <p className="mt-1 text-sm text-[#3a2e4d]/60">
          Edit the marketing site&apos;s text, lists, and links here. Changes save instantly and appear on the
          public site on next load.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CMS_SECTIONS.map((s) => (
          <Link key={s.key} href={`/admin/cms/${s.key}`}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{s.label}</CardTitle>
                <ChevronRight className="h-5 w-5 text-[#3a2e4d]/40" />
              </CardHeader>
              <p className="text-sm text-[#3a2e4d]/60">{s.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
