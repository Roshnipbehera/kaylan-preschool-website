"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { listStudents } from "@/lib/api/students";
import { listAnnouncements, createAnnouncement } from "@/lib/api/announcements";
import { queryKeys } from "@/lib/query/keys";
import { createAnnouncementSchema, type CreateAnnouncementFormValues } from "@/lib/validation/announcements";
import { TeacherSubNav } from "@/components/teacher/TeacherSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

export function TeacherAnnouncementsContent() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: students } = useQuery({
    queryKey: queryKeys.students(user?.id ? `teacher:${user.id}` : undefined),
    queryFn: () => listStudents({ teacherUserId: user?.id }),
    enabled: !!user?.id,
  });
  const classId = students?.[0]?.className ?? "";

  const { data: announcements, isLoading } = useQuery({
    queryKey: queryKeys.announcements,
    queryFn: listAnnouncements,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAnnouncementFormValues>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: {
      title: "",
      body: "",
      date: format(new Date(), "yyyy-MM-dd"),
      audience: "parents",
      classId,
      createdBy: user?.name ?? "",
    },
  });

  const onSubmit = async (values: CreateAnnouncementFormValues) => {
    try {
      await createAnnouncement({ ...values, createdBy: user?.name ?? values.createdBy, classId: values.classId || classId });
      toast.success("Announcement posted");
      reset({ title: "", body: "", date: format(new Date(), "yyyy-MM-dd"), audience: "parents", classId, createdBy: user?.name ?? "" });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post announcement");
    }
  };

  const classAndAllAnnouncements = (announcements ?? []).filter(
    (a) => !a.classId || a.classId === classId || a.audience === "all" || a.audience === "teachers",
  );

  return (
    <div>
      <TeacherSubNav />
      <h1 className="mb-6 font-display text-2xl font-bold text-[#3a2e4d]">Announcements</h1>

      <div className="grid gap-6 sm:grid-cols-[1fr_1.3fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>New Announcement</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField>
              <Input label="Title" {...register("title")} error={errors.title?.message} />
            </FormField>
            <FormField>
              <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Body</label>
              <textarea
                rows={4}
                className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 font-body text-[#3a2e4d] focus:outline-none focus:ring-2 focus:ring-candy focus:border-candy"
                {...register("body")}
              />
              {errors.body && <p className="mt-1 text-xs font-semibold text-red-500">{errors.body.message}</p>}
            </FormField>
            <FormField>
              <Input type="date" label="Date" {...register("date")} error={errors.date?.message} />
            </FormField>
            <FormField>
              <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Audience</label>
              <select
                className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 font-body text-[#3a2e4d] focus:outline-none focus:ring-2 focus:ring-candy focus:border-candy"
                {...register("audience")}
              >
                <option value="parents">Parents (my class)</option>
                <option value="all">Everyone</option>
                <option value="teachers">Teachers</option>
              </select>
            </FormField>
            <FormField>
              <Input label="Class" {...register("classId")} />
            </FormField>
            <div className="flex justify-end">
              <Button type="submit" isLoading={isSubmitting}>
                Post Announcement
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Announcements</CardTitle>
          </CardHeader>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : classAndAllAnnouncements.length === 0 ? (
            <p className="text-sm text-[#3a2e4d]/60">No announcements yet.</p>
          ) : (
            <div className="space-y-3">
              {classAndAllAnnouncements.map((a) => (
                <div key={a.id} className="rounded-xl bg-[#faf9ff] p-3">
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-heading text-sm font-semibold text-[#3a2e4d]">{a.title}</span>
                    <div className="flex gap-1.5">
                      <Badge tone="sky">{a.audience}</Badge>
                      {a.classId && <Badge tone="lavender">{a.classId}</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-[#3a2e4d]/70">{a.body}</p>
                  <p className="mt-1 text-[10px] text-[#3a2e4d]/40">{new Date(a.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
