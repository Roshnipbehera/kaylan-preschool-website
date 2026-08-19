"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Users } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { listStudents, updateStudent } from "@/lib/api/students";
import { updateStudentSchema, type UpdateStudentFormValues } from "@/lib/validation/students";
import { queryKeys } from "@/lib/query/keys";
import { ParentSubNav } from "@/components/parent/ParentSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Student } from "@/lib/types/students";

function ChildEditForm({ student, onDone }: { student: Student; onDone: () => void }) {
  const toast = useToast();
  const qc = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateStudentFormValues>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      bloodGroup: student.bloodGroup,
      allergies: student.allergies,
      photo: student.photo ?? "",
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      guardianEmail: student.guardianEmail,
      emergencyContact: student.emergencyContact,
    },
  });

  const onSubmit = async (values: UpdateStudentFormValues) => {
    setSubmitting(true);
    try {
      await updateStudent(student.id, values);
      await qc.invalidateQueries({ queryKey: queryKeys.students() });
      toast.success("Child profile updated.");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
      <FormField>
        <Input label="Blood Group" {...register("bloodGroup")} error={errors.bloodGroup?.message} />
      </FormField>
      <FormField>
        <Input label="Photo URL" {...register("photo")} error={errors.photo?.message} />
      </FormField>
      <FormField className="sm:col-span-2">
        <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Allergies</label>
        <textarea
          {...register("allergies")}
          rows={2}
          className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 text-sm focus:border-candy focus:outline-none focus:ring-2 focus:ring-candy"
        />
      </FormField>
      <FormField>
        <Input label="Guardian Name" {...register("guardianName")} error={errors.guardianName?.message} />
      </FormField>
      <FormField>
        <Input label="Guardian Phone" {...register("guardianPhone")} error={errors.guardianPhone?.message} />
      </FormField>
      <FormField className="sm:col-span-2">
        <Input label="Guardian Email" {...register("guardianEmail")} error={errors.guardianEmail?.message} />
      </FormField>
      <FormField>
        <Input label="Emergency Contact Name" {...register("emergencyContact.name")} error={errors.emergencyContact?.name?.message} />
      </FormField>
      <FormField>
        <Input label="Relationship" {...register("emergencyContact.relationship")} error={errors.emergencyContact?.relationship?.message} />
      </FormField>
      <FormField className="sm:col-span-2">
        <Input label="Emergency Contact Phone" {...register("emergencyContact.phone")} error={errors.emergencyContact?.phone?.message} />
      </FormField>
      <div className="sm:col-span-2 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" isLoading={submitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}

function ChildCard({ student }: { student: Student }) {
  const [editing, setEditing] = useState(false);
  const age = Math.floor((Date.now() - new Date(student.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users size={20} className="text-candy" /> {student.fullName}
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
          <Pencil size={14} className="mr-1" /> {editing ? "Cancel" : "Edit"}
        </Button>
      </CardHeader>

      {editing ? (
        <ChildEditForm student={student} onDone={() => setEditing(false)} />
      ) : (
        <dl className="grid gap-2 text-sm text-[#3a2e4d]/80 sm:grid-cols-2">
          <div><span className="font-heading font-semibold">Date of Birth:</span> {new Date(student.dateOfBirth).toLocaleDateString()} ({age} yrs)</div>
          <div><span className="font-heading font-semibold">Program:</span> {student.program}</div>
          <div><span className="font-heading font-semibold">Class:</span> {student.className}</div>
          <div><span className="font-heading font-semibold">Blood Group:</span> {student.bloodGroup}</div>
          <div className="sm:col-span-2"><span className="font-heading font-semibold">Allergies:</span> {student.allergies || "None reported"}</div>
          <div><span className="font-heading font-semibold">Guardian:</span> {student.guardianName}</div>
          <div><span className="font-heading font-semibold">Guardian Phone:</span> {student.guardianPhone}</div>
          <div className="sm:col-span-2"><span className="font-heading font-semibold">Guardian Email:</span> {student.guardianEmail}</div>
          <div className="sm:col-span-2 rounded-xl bg-[#faf9ff] p-3">
            <p className="font-heading font-semibold">Emergency Contact</p>
            <p>{student.emergencyContact.name} ({student.emergencyContact.relationship}) — {student.emergencyContact.phone}</p>
          </div>
        </dl>
      )}
    </Card>
  );
}

export function ChildProfileContent() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.students(user?.id),
    queryFn: () => listStudents({ parentUserId: user?.id }),
    enabled: !!user?.id,
  });

  return (
    <div>
      <ParentSubNav />
      <h1 className="mb-6 font-display text-2xl font-bold text-[#3a2e4d]">Child Profile</h1>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No child profiles linked to your account yet.</p>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {data.map((student) => (
            <ChildCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}
