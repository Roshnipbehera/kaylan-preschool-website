"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FileDown, FileText } from "lucide-react";
import { listApplications } from "@/lib/api/admissions";
import { queryKeys } from "@/lib/query/keys";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ParentSubNav } from "@/components/parent/ParentSubNav";
import type { AdmissionStatus } from "@/lib/types/admissions";

const STATUS_TONE: Record<AdmissionStatus, "sunshine" | "sky" | "leaf" | "candy" | "orange"> = {
  submitted: "sky",
  "under-review": "sunshine",
  accepted: "leaf",
  rejected: "candy",
  waitlisted: "orange",
};

export function ParentAdmissionsContent() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: [...queryKeys.admissions, user?.id],
    queryFn: () => listApplications({ parentUserId: user?.id }),
    enabled: !!user?.id,
  });

  return (
    <div>
      <ParentSubNav />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">My Admission Applications</h1>
        <Link href="/admissions/apply">
          <Button variant="secondary">New Application</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60 flex items-center gap-2">
            <FileText size={18} /> You haven&apos;t submitted any admission applications yet.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.map((app) => (
            <Card key={app.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{app.child.fullName}</CardTitle>
                <Badge tone={STATUS_TONE[app.status]}>{app.status.replace("-", " ")}</Badge>
              </CardHeader>
              <dl className="text-sm text-[#3a2e4d]/70 space-y-1 mb-4">
                <div>Program: {app.child.programApplyingFor}</div>
                <div>Application ID: <span className="font-mono text-xs">{app.id}</span></div>
                <div>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</div>
              </dl>
              <Button
                variant="outline"
                size="sm"
                onClick={() => import("@/lib/pdf/admissionReceipt").then(({ downloadAdmissionReceipt }) => downloadAdmissionReceipt(app))}
              >
                <FileDown size={16} className="mr-1" /> Download Receipt
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
