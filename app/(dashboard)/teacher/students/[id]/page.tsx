import { DashboardShell } from "@/components/layout/DashboardShell";
import { TeacherStudentDetailContent } from "./TeacherStudentDetailContent";

export default function TeacherStudentDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <TeacherStudentDetailContent studentId={params.id} />
    </DashboardShell>
  );
}
