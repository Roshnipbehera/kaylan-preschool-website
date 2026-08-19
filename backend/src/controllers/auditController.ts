import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Live Audit Log reads (Batch 4 migration pass). Replaces app/api/audit
// (JSON-backed, data/audit/logs.json) and the frontend-only
// lib/audit/logAction.ts writer. Writes now happen server-side via
// backend/src/lib/audit.ts's logAudit(), called directly from mutating
// controllers across the app. Response shape mirrors
// lib/types/audit.ts's AuditLogEntry.

export async function listAuditLogs(_req: Request, res: Response) {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  res.json({
    success: true,
    data: logs.map((l) => ({
      id: l.id,
      actor: l.actorName,
      action: l.action,
      category: l.category,
      createdAt: l.createdAt.toISOString(),
    })),
  });
}
