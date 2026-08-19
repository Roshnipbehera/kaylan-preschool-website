"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { listAnnouncements, createAnnouncement } from "@/lib/api/announcements";
import { queryKeys } from "@/lib/query/keys";
import { createAnnouncementSchema, type CreateAnnouncementFormValues } from "@/lib/validation/announcements";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

// Admin-facing Announcements management. Reuses the same
// lib/api/announcements.ts client and lib/validation/announcements.ts
// schema as app/(dashboard)/teacher/announcements/TeacherAnnouncementsContent.tsx
// (the admin role is already permitted to create announcements per
// backend/src/routes/announcementRoutes.ts's requireRole("teacher", "admin")),
// but shows every announcement school-wide (no per-class filtering) since
// the admin is not scoped to a single class the way a teacher is.
export function AdminAnnouncementsContent() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

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
      audience: "all",
      classId: "",
      createdBy: user?.name ?? "",
    },
  });

  const onSubmit = async (values: CreateAnnouncementFormValues) => {
    try {
      await createAnnouncement({ ...values, createdBy: user?.name ?? values.createdBy });
      toast.success("Announcement posted");
      reset({ title: "", body: "", date: format(new Date(), "yyyy-MM-dd"), audience: "all", classId: "", createdBy: user?.name ?? "" });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post announcement");
    }
  };

  const allAnnouncements = announcements ?? [];

  return (
    <div>
      <AdminSubNav />
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
                <option value="all">Everyone</option>
                <option value="parents">Parents</option>
                <option value="teachers">Teachers</option>
              </select>
            </FormField>
            <FormField>
              <Input label="Class (optional)" placeholder="Leave blank for school-wide" {...register("classId")} />
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
          ) : allAnnouncements.length === 0 ? (
            <p className="text-sm text-[#3a2e4d]/60">No announcements yet.</p>
          ) : (
            <div className="space-y-3">
              {allAnnouncements.map((a) => (
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
