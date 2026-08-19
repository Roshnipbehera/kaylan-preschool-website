"use client";

import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ImagePlus, Film, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { listStudents } from "@/lib/api/students";
import { listActivityLogsForStudents, createActivityLog } from "@/lib/api/activities";
import { uploadTeacherMedia } from "@/lib/api/upload";
import { queryKeys } from "@/lib/query/keys";
import { createActivityLogSchema, type CreateActivityLogFormValues } from "@/lib/validation/activities";
import { TeacherSubNav } from "@/components/teacher/TeacherSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ActivityCategory } from "@/lib/types/activities";

const CATEGORIES: ActivityCategory[] = ["learning", "play", "meal", "nap", "art", "outdoor"];

export function TeacherActivitiesContent() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [media, setMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: queryKeys.students(user?.id ? `teacher:${user.id}` : undefined),
    queryFn: () => listStudents({ teacherUserId: user?.id }),
    enabled: !!user?.id,
  });
  const studentIds = useMemo(() => (students ?? []).map((s) => s.id), [students]);

  const { data: logs, isLoading: loadingLogs } = useQuery({
    queryKey: queryKeys.classActivityLogs(studentIds.join(",")),
    queryFn: () => listActivityLogsForStudents(studentIds),
    enabled: studentIds.length > 0,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateActivityLogFormValues>({
    resolver: zodResolver(createActivityLogSchema),
    defaultValues: {
      studentId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: format(new Date(), "HH:mm"),
      category: "learning",
      title: "",
      notes: "",
      loggedBy: user?.name ?? "",
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadTeacherMedia(file);
      setMedia(result);
      toast.success(`${result.type === "video" ? "Video" : "Photo"} ready to attach.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: CreateActivityLogFormValues) => {
    try {
      await createActivityLog({
        ...values,
        loggedBy: user?.name ?? values.loggedBy,
        mediaUrl: media?.url,
        mediaType: media?.type,
      });
      toast.success("Activity logged");
      reset({
        studentId: values.studentId,
        date: format(new Date(), "yyyy-MM-dd"),
        time: format(new Date(), "HH:mm"),
        category: "learning",
        title: "",
        notes: "",
        loggedBy: user?.name ?? "",
      });
      setMedia(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: queryKeys.classActivityLogs(studentIds.join(",")) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to log activity");
    }
  };

  const studentName = (id: string) => students?.find((s) => s.id === id)?.fullName ?? id;

  const sortedLogs = useMemo(
    () =>
      [...(logs ?? [])].sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        return a.time < b.time ? 1 : -1;
      }),
    [logs],
  );

  return (
    <div>
      <TeacherSubNav />
      <h1 className="mb-6 font-display text-2xl font-bold text-[#3a2e4d]">Daily Activities</h1>

      {loadingStudents ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-[1fr_1.3fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Log an Activity</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormField>
                <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Student</label>
                <select
                  className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 font-body text-[#3a2e4d] focus:outline-none focus:ring-2 focus:ring-candy focus:border-candy"
                  {...register("studentId")}
                >
                  <option value="">Select a student</option>
                  {students?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName}
                    </option>
                  ))}
                </select>
                {errors.studentId && <p className="mt-1 text-xs font-semibold text-red-500">{errors.studentId.message}</p>}
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField>
                  <Input type="date" label="Date" {...register("date")} error={errors.date?.message} />
                </FormField>
                <FormField>
                  <Input type="time" label="Time" {...register("time")} error={errors.time?.message} />
                </FormField>
              </div>
              <FormField>
                <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Category</label>
                <select
                  className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 font-body text-[#3a2e4d] focus:outline-none focus:ring-2 focus:ring-candy focus:border-candy"
                  {...register("category")}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField>
                <Input label="Title" {...register("title")} error={errors.title?.message} />
              </FormField>
              <FormField>
                <Input label="Notes (optional)" {...register("notes")} />
              </FormField>
              <FormField>
                <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Photo / Video (optional)</label>
                <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} aria-label="Attach photo or video" />
                <Button type="button" variant="outline" size="sm" isLoading={uploading} onClick={() => fileInputRef.current?.click()}>
                  {uploading ? <Loader2 size={14} className="mr-1 animate-spin" /> : media?.type === "video" ? <Film size={14} className="mr-1" /> : <ImagePlus size={14} className="mr-1" />}
                  {media ? "Attached — replace" : "Attach photo/video"}
                </Button>
                {media && (
                  <div className="mt-2">
                    {media.type === "image" ? (
                      <p className="text-xs text-[#3a2e4d]/60">Image ready: {media.url.split("/").pop()}</p>
                    ) : (
                      <p className="text-xs text-[#3a2e4d]/60">Video ready: {media.url.split("/").pop()}</p>
                    )}
                  </div>
                )}
              </FormField>
              <div className="flex justify-end">
                <Button type="submit" isLoading={isSubmitting}>
                  Save Activity
                </Button>
              </div>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Class Activity</CardTitle>
            </CardHeader>
            {loadingLogs ? (
              <Skeleton className="h-64 w-full" />
            ) : sortedLogs.length === 0 ? (
              <p className="text-sm text-[#3a2e4d]/60">No activity logs yet.</p>
            ) : (
              <div className="max-h-[600px] space-y-3 overflow-y-auto">
                {sortedLogs.map((log) => (
                  <div key={log.id} className="rounded-xl bg-[#faf9ff] p-3">
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-heading text-sm font-semibold text-[#3a2e4d]">{studentName(log.studentId)}</span>
                      <Badge tone="orange">{log.category}</Badge>
                    </div>
                    <p className="text-sm text-[#3a2e4d]/70">{log.title}</p>
                    {log.notes && <p className="text-xs text-[#3a2e4d]/50">{log.notes}</p>}
                    {log.mediaUrl && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-sky-700">
                        {log.mediaType === "video" ? <Film size={12} /> : <ImagePlus size={12} />}
                        {log.mediaType === "video" ? "Video attached" : "Photo attached"}
                      </p>
                    )}
                    <p className="mt-1 text-[10px] text-[#3a2e4d]/40">
                      {new Date(log.date).toLocaleDateString()} · {log.time} · logged by {log.loggedBy}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
