"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil } from "lucide-react";
import { listUsers, createUser, updateUser, deleteUser } from "@/lib/api/users";
import { listStudents, adminUpdateStudent } from "@/lib/api/students";
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
import type { Student } from "@/lib/types/students";

function ParentForm({ existing, students, onDone }: { existing?: ManagedUser; students: Student[]; onDone: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: existing?.name ?? "",
      email: existing?.email ?? "",
      role: "parent",
      // linkedStudentIds is NOT part of the real backend's ManagedUser
      // payload -- Student.parentUserId (data/students/students.json) is
      // the source of truth for this link, kept JSON-backed out of scope
      // for this migration pass. Derive it here from the `students` list
      // already fetched for the checkbox UI below.
      linkedStudentIds: existing ? students.filter((s) => s.parentUserId === existing.id).map((s) => s.id) : [],
    },
  });

  const linkedStudentIds = watch("linkedStudentIds") ?? [];

  const toggleStudent = (id: string) => {
    const next = linkedStudentIds.includes(id) ? linkedStudentIds.filter((s) => s !== id) : [...linkedStudentIds, id];
    setValue("linkedStudentIds", next);
  };

  const onSubmit = async (values: CreateUserFormValues) => {
    try {
      let parentId = existing?.id;
      if (existing) {
        await updateUser(existing.id, { name: values.name, email: values.email });
        toast.success("Parent updated.");
      } else {
        const created = await createUser({ ...values, role: "parent" });
        parentId = created.id;
        toast.success(`Parent account created. Temporary password: ${created.tempPassword}`);
      }

      // Persist the child links to data/students/students.json
      // (Student.parentUserId) -- see the defaultValues comment above for
      // why this isn't part of the users API payload.
      if (parentId) {
        await Promise.all((values.linkedStudentIds ?? []).map((id) => adminUpdateStudent(id, { parentUserId: parentId })));
      }

      qc.invalidateQueries({ queryKey: queryKeys.managedUsers("parent") });
      qc.invalidateQueries({ queryKey: queryKeys.adminStats });
      qc.invalidateQueries({ queryKey: queryKeys.allStudents });
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save parent");
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
        <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Linked children</label>
        <div className="max-h-40 space-y-1.5 overflow-y-auto rounded-2xl border-2 border-lavender/40 p-3">
          {students.length === 0 && <p className="text-xs text-[#3a2e4d]/60">No student records yet.</p>}
          {students.map((s) => (
            <label key={s.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={linkedStudentIds.includes(s.id)} onChange={() => toggleStudent(s.id)} />
              {s.fullName} ({s.className})
            </label>
          ))}
        </div>
      </FormField>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          {existing ? "Save Changes" : "Create Parent"}
        </Button>
      </div>
    </form>
  );
}

export function AdminParentsContent() {
  const { openModal, closeModal } = useModal();
  const toast = useToast();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.managedUsers("parent"),
    queryFn: () => listUsers("parent"),
  });
  const { data: students } = useQuery({ queryKey: queryKeys.allStudents, queryFn: () => listStudents() });

  const deactivateMutation = useMutation({
    mutationFn: (u: ManagedUser) => updateUser(u.id, { isActive: !u.isActive }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.managedUsers("parent") });
      toast.success("Parent status updated.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.managedUsers("parent") });
      qc.invalidateQueries({ queryKey: queryKeys.adminStats });
      toast.success("Parent removed.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to delete parent"),
  });

  const studentsList = students ?? [];
  const studentsByParent = new Map<string, Student[]>();
  for (const s of studentsList) {
    studentsByParent.set(s.parentUserId, [...(studentsByParent.get(s.parentUserId) ?? []), s]);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Parents</h1>
        <Button
          onClick={() =>
            openModal({
              title: "Add Parent",
              content: <ParentForm students={students ?? []} onDone={closeModal} />,
            })
          }
        >
          <Plus size={16} className="mr-1" /> Add Parent
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
          <p className="text-sm text-[#3a2e4d]/60">No parent accounts yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.map((p) => (
            <Card key={p.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-heading font-semibold">{p.name}</p>
                <p className="text-xs text-[#3a2e4d]/60">{p.email}</p>
                <p className="mt-1 text-xs text-[#3a2e4d]/70">
                  Children:{" "}
                  {(studentsByParent.get(p.id) ?? []).length === 0
                    ? "None linked"
                    : (studentsByParent.get(p.id) ?? []).map((s) => s.fullName).join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={p.isActive ? "leaf" : "candy"}>{p.isActive ? "Active" : "Deactivated"}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    openModal({
                      title: `Edit ${p.name}`,
                      content: <ParentForm existing={p} students={students ?? []} onDone={closeModal} />,
                    })
                  }
                >
                  <Pencil size={14} className="mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deactivateMutation.mutate(p)}>
                  {p.isActive ? "Deactivate" : "Reactivate"}
                </Button>
                <Button variant="danger" size="sm" onClick={() => deleteMutation.mutate(p.id)}>
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
