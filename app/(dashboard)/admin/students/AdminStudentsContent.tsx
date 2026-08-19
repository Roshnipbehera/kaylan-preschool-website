"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil } from "lucide-react";
import { listStudents, createStudent, adminUpdateStudent, deleteStudent } from "@/lib/api/students";
import { listUsers } from "@/lib/api/users";
import { createStudentSchema, type CreateStudentFormValues } from "@/lib/validation/students";
import { queryKeys } from "@/lib/query/keys";
import { useModal } from "@/lib/hooks/useModal";
import { useToast } from "@/lib/hooks/useToast";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import type { Student } from "@/lib/types/students";

function StudentForm({ existing, onDone }: { existing?: Student; onDone: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const { data: parents } = useQuery({ queryKey: queryKeys.managedUsers("parent"), queryFn: () => listUsers("parent") });
  const { data: teachers } = useQuery({ queryKey: queryKeys.managedUsers("teacher"), queryFn: () => listUsers("teacher") });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: existing ?? {
      parentUserId: "",
      teacherUserId: "",
      fullName: "",
      dateOfBirth: "",
      program: "",
      className: "",
      bloodGroup: "",
      allergies: "",
      photo: "",
      guardianName: "",
      guardianPhone: "",
      guardianEmail: "",
      emergencyContact: { name: "", relationship: "", phone: "" },
    },
  });

  const onSubmit = async (values: CreateStudentFormValues) => {
    try {
      if (existing) {
        await adminUpdateStudent(existing.id, values);
        toast.success("Student updated.");
      } else {
        await createStudent(values);
        toast.success("Student created.");
      }
      qc.invalidateQueries({ queryKey: queryKeys.allStudents });
      qc.invalidateQueries({ queryKey: queryKeys.adminStats });
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save student");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-h-[70vh] overflow-y-auto pr-1">
      <FormField>
        <Input label="Full name" {...register("fullName")} error={errors.fullName?.message} />
      </FormField>
      <FormField>
        <Input label="Date of birth" type="date" {...register("dateOfBirth")} error={errors.dateOfBirth?.message} />
      </FormField>
      <FormField>
        <Input label="Program" placeholder="e.g. Nursery" {...register("program")} error={errors.program?.message} />
      </FormField>
      <FormField>
        <Input label="Class" placeholder="e.g. Sunshine Room" {...register("className")} error={errors.className?.message} />
      </FormField>
      <FormField>
        <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Parent</label>
        <select {...register("parentUserId")} className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5">
          <option value="">Select parent</option>
          {(parents ?? []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.email})
            </option>
          ))}
        </select>
        {errors.parentUserId && <p className="mt-1 text-xs font-semibold text-red-500">{errors.parentUserId.message}</p>}
      </FormField>
      <FormField>
        <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Teacher</label>
        <select {...register("teacherUserId")} className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5">
          <option value="">Unassigned</option>
          {(teachers ?? []).map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField>
        <Input label="Blood group" {...register("bloodGroup")} error={errors.bloodGroup?.message} />
      </FormField>
      <FormField>
        <Input label="Allergies" {...register("allergies")} />
      </FormField>
      <FormField>
        <Input label="Guardian name" {...register("guardianName")} error={errors.guardianName?.message} />
      </FormField>
      <FormField>
        <Input label="Guardian phone" {...register("guardianPhone")} error={errors.guardianPhone?.message} />
      </FormField>
      <FormField>
        <Input label="Guardian email" type="email" {...register("guardianEmail")} error={errors.guardianEmail?.message} />
      </FormField>
      <FormField>
        <Input label="Emergency contact name" {...register("emergencyContact.name")} error={errors.emergencyContact?.name?.message} />
      </FormField>
      <FormField>
        <Input label="Emergency contact relationship" {...register("emergencyContact.relationship")} error={errors.emergencyContact?.relationship?.message} />
      </FormField>
      <FormField>
        <Input label="Emergency contact phone" {...register("emergencyContact.phone")} error={errors.emergencyContact?.phone?.message} />
      </FormField>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          {existing ? "Save Changes" : "Create Student"}
        </Button>
      </div>
    </form>
  );
}

export function AdminStudentsContent() {
  const { openModal, closeModal } = useModal();
  const toast = useToast();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: queryKeys.allStudents, queryFn: () => listStudents() });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.allStudents });
      qc.invalidateQueries({ queryKey: queryKeys.adminStats });
      toast.success("Student record deleted.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to delete student"),
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Students</h1>
        <Button onClick={() => openModal({ title: "Add Student", content: <StudentForm onDone={closeModal} /> })}>
          <Plus size={16} className="mr-1" /> Add Student
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
          <p className="text-sm text-[#3a2e4d]/60">No student records yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.map((s) => (
            <Card key={s.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-heading font-semibold">{s.fullName}</p>
                <p className="text-xs text-[#3a2e4d]/60">
                  {s.program} · {s.className} · DOB {s.dateOfBirth}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal({ title: `Edit ${s.fullName}`, content: <StudentForm existing={s} onDone={closeModal} /> })}
                >
                  <Pencil size={14} className="mr-1" /> Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => deleteMutation.mutate(s.id)}>
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
