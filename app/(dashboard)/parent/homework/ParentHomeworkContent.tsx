"use client";

import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { listStudents } from "@/lib/api/students";
import { listHomework, updateHomeworkStatus } from "@/lib/api/homework";
import { queryKeys } from "@/lib/query/keys";
import { ParentSubNav } from "@/components/parent/ParentSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { HomeworkStatus } from "@/lib/types/homework";

const STATUS_TONE: Record<HomeworkStatus, "leaf" | "sunshine" | "candy"> = {
  submitted: "leaf",
  pending: "sunshine",
  overdue: "candy",
};

const STATUS_ICON: Record<HomeworkStatus, typeof CheckCircle2> = {
  submitted: CheckCircle2,
  pending: Clock,
  overdue: AlertTriangle,
};

export function ParentHomeworkContent() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: students } = useQuery({
    queryKey: queryKeys.students(user?.id),
    queryFn: () => listStudents({ parentUserId: user?.id }),
    enabled: !!user?.id,
  });
  const student = students?.[0];

  const { data: assignments, isLoading } = useQuery({
    queryKey: queryKeys.homework(student?.className),
    queryFn: () => listHomework({ className: student!.className }),
    enabled: !!student?.className,
  });

  const sorted = useMemo(
    () => [...(assignments ?? [])].sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1)),
    [assignments],
  );

  const markSubmitted = async (id: string) => {
    try {
      await updateHomeworkStatus(id, "submitted");
      await queryClient.invalidateQueries({ queryKey: queryKeys.homework(student?.className) });
      toast.success("Marked as submitted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update homework");
    }
  };

  return (
    <div>
      <ParentSubNav />
      <h1 className="mb-6 font-display text-2xl font-bold text-[#3a2e4d]">
        Homework {student ? `— ${student.fullName}` : ""}
      </h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No homework assigned right now.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sorted.map((hw) => {
            const StatusIcon = STATUS_ICON[hw.status];
            return (
              <Card key={hw.id}>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={18} className="text-sky" /> {hw.title}
                  </CardTitle>
                  <Badge tone={STATUS_TONE[hw.status]} className="flex items-center gap-1">
                    <StatusIcon size={12} /> {hw.status}
                  </Badge>
                </CardHeader>
                <p className="mb-2 text-xs font-heading font-semibold uppercase tracking-wide text-[#3a2e4d]/40">
                  {hw.subject}
                </p>
                <p className="mb-3 text-sm text-[#3a2e4d]/70">{hw.description}</p>
                <dl className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#3a2e4d]/70">
                  <div>Assigned: {new Date(hw.assignedDate).toLocaleDateString()}</div>
                  <div>Due: {new Date(hw.dueDate).toLocaleDateString()}</div>
                </dl>
                {hw.status !== "submitted" && (
                  <Button size="sm" onClick={() => markSubmitted(hw.id)}>
                    Mark as submitted
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
