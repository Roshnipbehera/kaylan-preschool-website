"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { useModal } from "@/components/ui/Modal";
import { listStudents } from "@/lib/api/students";
import { listHomework, createHomework, updateHomework, deleteHomework, updateHomeworkStatus } from "@/lib/api/homework";
import { queryKeys } from "@/lib/query/keys";
import { createHomeworkSchema, type CreateHomeworkFormValues } from "@/lib/validation/homework";
import { TeacherSubNav } from "@/components/teacher/TeacherSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Homework, HomeworkStatus } from "@/lib/types/homework";

const STATUS_TONE: Record<HomeworkStatus, "leaf" | "sunshine" | "candy"> = {
  submitted: "leaf",
  pending: "sunshine",
  overdue: "candy",
};

function AssignmentForm({
  defaultValues,
  className,
  teacherId,
  onSaved,
  onCancel,
}: {
  defaultValues?: Homework;
  className: string;
  teacherId: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateHomeworkFormValues>({
    resolver: zodResolver(createHomeworkSchema),
    defaultValues: defaultValues
      ? {
          className: defaultValues.className,
          subject: defaultValues.subject,
          title: defaultValues.title,
          description: defaultValues.description,
          assignedDate: defaultValues.assignedDate,
          dueDate: defaultValues.dueDate,
          status: defaultValues.status,
          teacherId: defaultValues.teacherId ?? teacherId,
        }
      : {
          className,
          subject: "",
          title: "",
          description: "",
          assignedDate: new Date().toISOString().slice(0, 10),
          dueDate: new Date().toISOString().slice(0, 10),
          status: "pending",
          teacherId,
        },
  });

  const onSubmit = async (values: CreateHomeworkFormValues) => {
    try {
      if (defaultValues) {
        await updateHomework(defaultValues.id, values);
        toast.success("Assignment updated");
      } else {
        await createHomework(values);
        toast.success("Assignment created");
      }
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save assignment");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField>
        <Input label="Title" {...register("title")} error={errors.title?.message} />
      </FormField>
      <FormField>
        <Input label="Subject" {...register("subject")} error={errors.subject?.message} />
      </FormField>
      <FormField>
        <Input label="Class" {...register("className")} error={errors.className?.message} />
      </FormField>
      <FormField>
        <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Description</label>
        <textarea
          rows={3}
          className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 font-body text-[#3a2e4d] focus:outline-none focus:ring-2 focus:ring-candy focus:border-candy"
          {...register("description")}
        />
        {errors.description && <p className="mt-1 text-xs font-semibold text-red-500">{errors.description.message}</p>}
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField>
          <Input type="date" label="Assigned date" {...register("assignedDate")} error={errors.assignedDate?.message} />
        </FormField>
        <FormField>
          <Input type="date" label="Due date" {...register("dueDate")} error={errors.dueDate?.message} />
        </FormField>
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {defaultValues ? "Save Changes" : "Create Assignment"}
        </Button>
      </div>
    </form>
  );
}

export function TeacherAssignmentsContent() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();

  const { data: students } = useQuery({
    queryKey: queryKeys.students(user?.id ? `teacher:${user.id}` : undefined),
    queryFn: () => listStudents({ teacherUserId: user?.id }),
    enabled: !!user?.id,
  });
  const primaryClass = students?.[0]?.className ?? "";

  const { data: assignments, isLoading } = useQuery({
    queryKey: queryKeys.homework(user?.id ? `teacher:${user.id}` : undefined),
    queryFn: () => listHomework({ teacherId: user?.id }),
    enabled: !!user?.id,
  });

  const refresh = () => {
    closeModal();
    queryClient.invalidateQueries({ queryKey: ["homework"] });
  };

  const openCreate = () => {
    openModal({
      title: "New Assignment",
      content: (
        <AssignmentForm className={primaryClass} teacherId={user?.id ?? ""} onSaved={refresh} onCancel={closeModal} />
      ),
    });
  };

  const openEdit = (hw: Homework) => {
    openModal({
      title: "Edit Assignment",
      content: (
        <AssignmentForm
          defaultValues={hw}
          className={hw.className}
          teacherId={user?.id ?? ""}
          onSaved={refresh}
          onCancel={closeModal}
        />
      ),
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHomework(id);
      toast.success("Assignment deleted");
      queryClient.invalidateQueries({ queryKey: ["homework"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete assignment");
    }
  };

  const handleStatusChange = async (id: string, status: HomeworkStatus) => {
    try {
      await updateHomeworkStatus(id, status);
      queryClient.invalidateQueries({ queryKey: ["homework"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const sorted = useMemo(() => [...(assignments ?? [])].sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1)), [assignments]);

  return (
    <div>
      <TeacherSubNav />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Assignments</h1>
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-1" /> New Assignment
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No assignments yet. Create your first one.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((hw) => (
            <Card key={hw.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <CardTitle className="text-base">{hw.title}</CardTitle>
                    <Badge tone="lavender">{hw.className}</Badge>
                    <Badge tone="orange">{hw.subject}</Badge>
                  </div>
                  <p className="text-sm text-[#3a2e4d]/60">{hw.description}</p>
                  <p className="mt-1 text-xs text-[#3a2e4d]/50">
                    Assigned {new Date(hw.assignedDate).toLocaleDateString()} · Due {new Date(hw.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select
                    value={hw.status}
                    onChange={(e) => handleStatusChange(hw.id, e.target.value as HomeworkStatus)}
                    className="rounded-full border-2 border-black/10 bg-white px-3 py-1 text-xs font-heading font-semibold text-[#3a2e4d]"
                    aria-label={`Status for ${hw.title}`}
                  >
                    <option value="pending">pending</option>
                    <option value="submitted">submitted</option>
                    <option value="overdue">overdue</option>
                  </select>
                  <Badge tone={STATUS_TONE[hw.status]}>{hw.status}</Badge>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => openEdit(hw)} aria-label={`Edit ${hw.title}`}>
                      <Pencil size={14} />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(hw.id)} aria-label={`Delete ${hw.title}`}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
