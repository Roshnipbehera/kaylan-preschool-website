import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { readUsers } from "@/app/api/users/_store";
import { readStudents } from "@/app/api/students/_store";
import { readInvoices, readPayments } from "@/app/api/fees/_store";
import { readAttendanceRecords } from "@/app/api/attendance/_store";

async function readJsonSafe<T>(relPath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), relPath), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function GET() {
  try {
    const [users, students, invoices, payments, attendance, blogPosts, albums, events, applications] = await Promise.all([
      readUsers(),
      readStudents(),
      readInvoices(),
      readPayments(),
      readAttendanceRecords(),
      readJsonSafe<unknown[]>("data/blog/posts.json", []),
      readJsonSafe<{ items?: unknown[] }[]>("data/gallery/albums.json", []),
      readJsonSafe<{ date?: string }[]>("data/events/events.json", []),
      readAdmissions(),
    ]);

    const totalTeachers = users.filter((u) => u.role === "teacher").length;
    const totalParents = users.filter((u) => u.role === "parent").length;
    const totalStudents = students.length;

    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const admissionsThisMonth = applications.filter((a) => a.submittedAt?.startsWith(monthPrefix));
    const admissionsByStatus: Record<string, number> = {};
    for (const a of admissionsThisMonth) {
      admissionsByStatus[a.status] = (admissionsByStatus[a.status] ?? 0) + 1;
    }

    const attendanceThisMonth = attendance.filter((r) => r.date.startsWith(monthPrefix));
    const presentCount = attendanceThisMonth.filter((r) => r.status === "present").length;
    const attendanceRate = attendanceThisMonth.length > 0 ? Math.round((presentCount / attendanceThisMonth.length) * 100) : 0;

    const totalInvoiced = invoices.reduce((sum, i) => sum + i.amount, 0);
    const totalPaid = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
    const totalPending = invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.amount, 0);
    const totalOverdue = invoices.filter((i) => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);
    const feeCollectionRate = totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0;

    const galleryItemCount = albums.reduce((sum, a) => sum + (a.items?.length ?? 0), 0);
    const upcomingEventsCount = events.filter((e) => !e.date || e.date >= now.toISOString().slice(0, 10)).length;

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalParents,
        admissionsThisMonth: admissionsThisMonth.length,
        admissionsByStatus,
        attendanceRate,
        attendanceSampleSize: attendanceThisMonth.length,
        fees: { totalInvoiced, totalPaid, totalPending, totalOverdue, feeCollectionRate },
        blogPostCount: blogPosts.length,
        galleryItemCount,
        upcomingEventsCount,
        paymentsCount: payments.length,
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to compute stats" }, { status: 500 });
  }
}

async function readAdmissions(): Promise<{ status: string; submittedAt: string }[]> {
  const dir = path.join(process.cwd(), "data", "admissions");
  try {
    const files = await fs.readdir(dir);
    const apps = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          const raw = await fs.readFile(path.join(dir, f), "utf-8");
          return JSON.parse(raw) as { status: string; submittedAt: string };
        })
    );
    return apps;
  } catch {
    return [];
  }
}
