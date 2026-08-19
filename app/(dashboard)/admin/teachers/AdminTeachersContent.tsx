"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil } from "lucide-react";
import { listUsers, createUser, updateUser, deleteUser } from "@/lib/api/users";
import { createUserSchema, type CreateUserFormValues } from "@/lib/validation/users";
import { queryKeys } from "@/lib/query/keys";
import { useModal } from "@/lib/hooks/useModal";
import { useToast } from "@/lib/hooks/useToast";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import type { ManagedUser } from "@/lib/types/users";

function TeacherForm({ existing, onDone }: { existing?: ManagedUser; onDone: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: existing?.name ?? "",
      email: existing?.email ?? "",
      role: "teacher",
      className: existing?.className ?? "",
      subject: existing?.subject ?? "",
    },
  });

  const onSubmit = async (values: CreateUserFormValues) => {
    try {
      if (existing) {
        await updateUser(existing.id, { name: values.name, email: values.email, className: values.className, subject: values.subject });
        toast.success("Teacher updated.");
      } else {
        const created = await createUser({ ...values, role: "teacher" });
        toast.success(`Teacher account created. Temporary password: ${created.tempPassword}`);
      }
      qc.invalidateQueries({ queryKey: queryKeys.managedUsers("teacher") });
      qc.invalidateQueries({ queryKey: queryKeys.adminStats });
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save teacher");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <Input label="Full name" {...register("name")} error={errors.name?.message} />
      </FormField>
      <FormField>
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} disabled={!!existing} />
      </FormField>
      <FormField>
        <Input label="Class assignment" placeholder="e.g. Sunshine Room" {...register("className")} error={errors.className?.message} />
      </FormField>
      <FormField>
        <Input label="Subject" placeholder="e.g. Early Literacy" {...register("subject")} error={errors.subject?.message} />
      </FormField>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          {existing ? "Save Changes" : "Create Teacher"}
        </Button>
      </div>
    </form>
  );
}

export function AdminTeachersContent() {
  const { openModal, closeModal } = useModal();
  const toast = useToast();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.managedUsers("teacher"),
    queryFn: () => listUsers("teacher"),
  });

  const deactivateMutation = useMutation({
    mutationFn: (u: ManagedUser) => updateUser(u.id, { isActive: !u.isActive }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.managedUsers("teacher") });
      toast.success("Teacher status updated.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.managedUsers("teacher") });
      qc.invalidateQueries({ queryKey: queryKeys.adminStats });
      toast.success("Teacher removed.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to delete teacher"),
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Teachers</h1>
        <Button
          onClick={() =>
            openModal({
              title: "Add Teacher",
              content: <TeacherForm onDone={closeModal} />,
            })
          }
        >
          <Plus size={16} className="mr-1" /> Add Teacher
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No teacher accounts yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.map((t) => (
            <Card key={t.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-heading font-semibold">{t.name}</p>
                <p className="text-xs text-[#3a2e4d]/60">
                  {t.email} · {t.className || "Unassigned"} · {t.subject || "—"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={t.isActive ? "leaf" : "candy"}>{t.isActive ? "Active" : "Deactivated"}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    openModal({
                      title: `Edit ${t.name}`,
                      content: <TeacherForm existing={t} onDone={closeModal} />,
                    })
                  }
                >
                  <Pencil size={14} className="mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deactivateMutation.mutate(t)}>
                  {t.isActive ? "Deactivate" : "Reactivate"}
                </Button>
                <Button variant="danger" size="sm" onClick={() => deleteMutation.mutate(t.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
