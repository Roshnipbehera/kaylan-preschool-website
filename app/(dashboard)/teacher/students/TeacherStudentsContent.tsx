"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/hooks/useAuth";
import { listStudents } from "@/lib/api/students";
import { queryKeys } from "@/lib/query/keys";
import { TeacherSubNav } from "@/components/teacher/TeacherSubNav";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

export function TeacherStudentsContent() {
  const { user } = useAuth();

  const { data: students, isLoading } = useQuery({
    queryKey: queryKeys.students(user?.id ? `teacher:${user.id}` : undefined),
    queryFn: () => listStudents({ teacherUserId: user?.id }),
    enabled: !!user?.id,
  });

  return (
    <div>
      <TeacherSubNav />
      <h1 className="mb-6 font-display text-2xl font-bold text-[#3a2e4d]">My Students</h1>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : !students || students.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No students are assigned to your class yet.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s) => (
            <Link key={s.id} href={`/teacher/students/${s.id}`}>
              <Card className="h-full transition-transform hover:-translate-y-0.5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold text-[#3a2e4d]">{s.fullName}</h3>
                  <Badge tone="sky">{s.className}</Badge>
                </div>
                <p className="text-sm text-[#3a2e4d]/60">{s.program}</p>
                <p className="mt-2 text-xs text-[#3a2e4d]/50">
                  DOB: {new Date(s.dateOfBirth).toLocaleDateString()}
                </p>
                {s.allergies && s.allergies !== "None" && (
                  <p className="mt-1 text-xs font-semibold text-red-500">Allergy: {s.allergies}</p>
                )}
                <p className="mt-2 text-xs text-[#3a2e4d]/50">Guardian: {s.guardianName}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
