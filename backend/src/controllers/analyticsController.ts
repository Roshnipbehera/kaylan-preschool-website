import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Live Admin Analytics (Batch 4 migration pass). Replaces
// app/api/admin/stats (which computed stats client/server-side from
// scattered JSON files). Response shape mirrors lib/api/adminStats.ts's
// AdminStats interface exactly via real Prisma aggregate queries.

export async function getStats(_req: Request, res: Response) {
  const [totalStudents, totalTeachers, totalParents, admissions, attendanceRows, invoices, payments, blogPostCount, galleryItemCount, upcomingEventsCount] =
    await Promise.all([
      prisma.student.count(),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.user.count({ where: { role: "PARENT" } }),
      prisma.admissionApplication.findMany({ select: { status: true, submittedAt: true } }),
      prisma.attendance.findMany({ select: { status: true } }),
      prisma.feeInvoice.findMany({ select: { amount: true, status: true } }),
      prisma.feePayment.count(),
      prisma.blogPost.count(),
      prisma.galleryItem.count(),
      prisma.event.count({ where: { date: { gte: new Date() } } }),
    ]);

  const admissionsByStatus: Record<string, number> = {};
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  let admissionsThisMonth = 0;
  for (const a of admissions) {
    admissionsByStatus[a.status] = (admissionsByStatus[a.status] ?? 0) + 1;
    if (a.submittedAt >= startOfMonth) admissionsThisMonth += 1;
  }

  const presentCount = attendanceRows.filter((r) => r.status === "present" || r.status === "late").length;
  const attendanceRate = attendanceRows.length ? Math.round((presentCount / attendanceRows.length) * 1000) / 10 : 0;

  const totalInvoiced = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);
  const feeCollectionRate = totalInvoiced ? Math.round((totalPaid / totalInvoiced) * 1000) / 10 : 0;

  res.json({
    success: true,
    data: {
      totalStudents,
      totalTeachers,
      totalParents,
      admissionsThisMonth,
      admissionsByStatus,
      attendanceRate,
      attendanceSampleSize: attendanceRows.length,
      fees: { totalInvoiced, totalPaid, totalPending, totalOverdue, feeCollectionRate },
      blogPostCount,
      galleryItemCount,
      upcomingEventsCount,
      paymentsCount: payments,
    },
  });
}
