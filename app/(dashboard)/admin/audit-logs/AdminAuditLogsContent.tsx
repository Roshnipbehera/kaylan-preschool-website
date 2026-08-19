"use client";

import { useQuery } from "@tanstack/react-query";
import { listAuditLogs } from "@/lib/api/audit";
import { queryKeys } from "@/lib/query/keys";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import type { AuditCategory } from "@/lib/types/audit";

const CATEGORY_TONE: Record<AuditCategory, "sunshine" | "sky" | "leaf" | "candy" | "orange" | "lavender"> = {
  cms: "sky",
  admissions: "sunshine",
  attendance: "leaf",
  fees: "candy",
  users: "orange",
  students: "lavender",
  roles: "sky",
  settings: "orange",
};

export function AdminAuditLogsContent() {
  const { data, isLoading } = useQuery({ queryKey: queryKeys.auditLogs, queryFn: listAuditLogs, refetchInterval: 15000 });

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-[#3a2e4d]">Audit Logs</h1>
      <p className="mb-6 text-sm text-[#3a2e4d]/60">
        Append-only record of significant admin and system actions. Refreshes automatically as new actions occur.
      </p>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No actions logged yet.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {data.map((log) => (
            <Card key={log.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="font-heading text-sm font-semibold text-[#3a2e4d]">{log.action}</p>
                <p className="text-xs text-[#3a2e4d]/60">
                  {log.actor} · {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
              <Badge tone={CATEGORY_TONE[log.category]}>{log.category}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
