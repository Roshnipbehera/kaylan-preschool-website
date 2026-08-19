"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Palette, Utensils, Moon, TreePine, BookOpenText, Blocks } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { listStudents } from "@/lib/api/students";
import { listActivityLogs } from "@/lib/api/activities";
import { queryKeys } from "@/lib/query/keys";
import { ParentSubNav } from "@/components/parent/ParentSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ActivityCategory, ActivityLog } from "@/lib/types/activities";

const CATEGORY_ICON: Record<ActivityCategory, typeof Palette> = {
  learning: BookOpenText,
  play: Blocks,
  meal: Utensils,
  nap: Moon,
  art: Palette,
  outdoor: TreePine,
};

const CATEGORY_TONE: Record<ActivityCategory, "sunshine" | "sky" | "candy" | "leaf" | "orange" | "lavender"> = {
  learning: "sky",
  play: "lavender",
  meal: "orange",
  nap: "sunshine",
  art: "candy",
  outdoor: "leaf",
};

export function ParentActivitiesContent() {
  const { user } = useAuth();

  const { data: students } = useQuery({
    queryKey: queryKeys.students(user?.id),
    queryFn: () => listStudents({ parentUserId: user?.id }),
    enabled: !!user?.id,
  });
  const student = students?.[0];

  const { data: logs, isLoading } = useQuery({
    queryKey: queryKeys.activityLogs(student?.id ?? ""),
    queryFn: () => listActivityLogs({ studentId: student!.id }),
    enabled: !!student?.id,
  });

  const grouped = useMemo(() => {
    const map = new Map<string, ActivityLog[]>();
    (logs ?? []).forEach((log) => {
      const list = map.get(log.date) ?? [];
      list.push(log);
      map.set(log.date, list);
    });
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [logs]);

  return (
    <div>
      <ParentSubNav />
      <h1 className="mb-6 font-display text-2xl font-bold text-[#3a2e4d]">
        Daily Activities {student ? `— ${student.fullName}` : ""}
      </h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No activity logs yet.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {grouped.map(([date, entries]) => (
            <div key={date}>
              <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-[#3a2e4d]/50">
                {format(new Date(date), "EEEE, MMMM d, yyyy")}
              </h2>
              <div className="space-y-3 border-l-2 border-lavender/30 pl-4">
                {[...entries]
                  .sort((a, b) => (a.time < b.time ? -1 : 1))
                  .map((entry) => {
                    const Icon = CATEGORY_ICON[entry.category];
                    return (
                      <Card key={entry.id} className="relative">
                        <div className="absolute -left-[26px] top-6 flex h-4 w-4 items-center justify-center rounded-full bg-candy" />
                        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Icon size={16} className="text-candy" /> {entry.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge tone={CATEGORY_TONE[entry.category]}>{entry.category}</Badge>
                            <span className="text-xs text-[#3a2e4d]/50">{entry.time}</span>
                          </div>
                        </CardHeader>
                        {entry.notes && <p className="text-sm text-[#3a2e4d]/70">{entry.notes}</p>}
                        <p className="mt-2 text-xs text-[#3a2e4d]/40">Logged by {entry.loggedBy}</p>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
