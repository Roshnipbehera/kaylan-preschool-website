"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { listStudents } from "@/lib/api/students";
import { listProgressReports, createProgressReport, deleteProgressReport } from "@/lib/api/progress";
import { queryKeys } from "@/lib/query/keys";
import { createProgressReportSchema, type CreateProgressReportFormValues } from "@/lib/validation/progress";
import { TeacherSubNav } from "@/components/teacher/TeacherSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

export function TeacherProgressContent() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: queryKeys.students(user?.id ? `teacher:${user.id}` : undefined),
    queryFn: () => listStudents({ teacherUserId: user?.id }),
    enabled: !!user?.id,
  });

  const activeStudentId = selectedStudentId || students?.[0]?.id || "";

  const { data: reports, isLoading: loadingReports } = useQuery({
    queryKey: queryKeys.progressReports(activeStudentId),
    queryFn: () => listProgressReports({ studentId: activeStudentId }),
    enabled: !!activeStudentId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProgressReportFormValues>({
    resolver: zodResolver(createProgressReportSchema),
    defaultValues: {
      studentId: activeStudentId,
      teacherId: user?.id ?? "",
      teacherName: user?.name ?? "",
      period: "",
      remarks: "",
      milestones: [],
    },
  });

  const [milestonesText, setMilestonesText] = useState("");

  const onSubmit = async (values: CreateProgressReportFormValues) => {
    if (!activeStudentId || !user) return;
    const milestones = milestonesText
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    try {
      await createProgressReport({
        ...values,
        studentId: activeStudentId,
        teacherId: user.id,
        teacherName: user.name,
        milestones: milestones.length > 0 ? milestones : ["General progress noted"],
      });
      toast.success("Progress report saved");
      reset({ studentId: activeStudentId, teacherId: user.id, teacherName: user.name, period: "", remarks: "", milestones: [] });
      setMilestonesText("");
      queryClient.invalidateQueries({ queryKey: queryKeys.progressReports(activeStudentId) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save progress report");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProgressReport(id);
      toast.success("Report deleted");
      queryClient.invalidateQueries({ queryKey: queryKeys.progressReports(activeStudentId) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete report");
    }
  };

  return (
    <div>
      <TeacherSubNav />
      <h1 className="mb-6 font-display text-2xl font-bold text-[#3a2e4d]">Progress Reports</h1>

      {loadingStudents ? (
        <Skeleton className="h-96 w-full" />
      ) : !students || students.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No students assigned.</p>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-[1fr_2fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Student</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-heading transition-colors ${
                    s.id === activeStudentId ? "bg-sky text-white" : "bg-[#faf9ff] text-[#3a2e4d] hover:bg-sky/10"
                  }`}
                >
                  {s.fullName}
                </button>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Write a Report</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormField>
                  <Input label="Period" placeholder="e.g. Term 3, 2026" {...register("period")} error={errors.period?.message} />
                </FormField>
                <FormField>
                  <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Remarks</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 font-body text-[#3a2e4d] focus:outline-none focus:ring-2 focus:ring-candy focus:border-candy"
                    {...register("remarks")}
                  />
                  {errors.remarks && <p className="mt-1 text-xs font-semibold text-red-500">{errors.remarks.message}</p>}
                </FormField>
                <FormField>
                  <Input
                    label="Milestones (comma separated)"
                    placeholder="Counts to 20, Shares toys"
                    value={milestonesText}
                    onChange={(e) => setMilestonesText(e.target.value)}
                  />
                </FormField>
                <div className="flex justify-end">
                  <Button type="submit" isLoading={isSubmitting} disabled={!activeStudentId}>
                    Save Report
                  </Button>
                </div>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>History</CardTitle>
              </CardHeader>
              {loadingReports ? (
                <Skeleton className="h-32 w-full" />
              ) : !reports || reports.length === 0 ? (
                <p className="text-sm text-[#3a2e4d]/60">No reports yet for this student.</p>
              ) : (
                <div className="space-y-3">
                  {reports.map((r) => (
                    <div key={r.id} className="rounded-xl bg-[#faf9ff] p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-heading text-sm font-semibold text-[#3a2e4d]">{r.period}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#3a2e4d]/50">{new Date(r.createdAt).toLocaleDateString()}</span>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(r.id)} aria-label={`Delete ${r.period} report`}>
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-[#3a2e4d]/70">{r.remarks}</p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {r.milestones.map((m) => (
                          <Badge key={m} tone="leaf" className="text-[10px]">{m}</Badge>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
