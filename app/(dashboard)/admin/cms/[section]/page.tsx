"use client";

import { notFound, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { CmsSectionEditor } from "@/components/admin/CmsSectionEditor";
import { getCmsSection } from "@/lib/api/cms";
import { queryKeys } from "@/lib/query/keys";
import { CMS_SECTIONS, type CmsSectionKey } from "@/lib/types/cms";

function isCmsSectionKey(v: string): v is CmsSectionKey {
  return CMS_SECTIONS.some((s) => s.key === v);
}

export default function CmsSectionAdminPage() {
  const params = useParams<{ section: string }>();
  const sectionParam = params.section;

  if (!isCmsSectionKey(sectionParam)) {
    notFound();
  }
  const section = sectionParam as CmsSectionKey;
  const meta = CMS_SECTIONS.find((s) => s.key === section)!;

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.cms(section),
    queryFn: () => getCmsSection(section),
  });

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">{meta.label}</h1>
        <p className="mt-1 text-sm text-[#3a2e4d]/60">{meta.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit content</CardTitle>
        </CardHeader>

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-2/3" />
          </div>
        )}

        {isError && <p className="text-sm font-semibold text-red-500">Could not load this section&apos;s content.</p>}

        {data && <CmsSectionEditor section={section} initialData={data} />}
      </Card>
    </DashboardShell>
  );
}
