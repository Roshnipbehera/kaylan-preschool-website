// Shared server-side audit-logging helper (Batch 4 migration pass).
// Replaces the old frontend-only lib/audit/logAction.ts (which appended to
// data/audit/logs.json). Controllers call this directly via Prisma after a
// meaningful mutation succeeds -- no HTTP round trip. Mirrors AuditLog model
// in schema.prisma. Must never throw: audit logging must not break the
// primary mutation.
import { Request } from "express";
import { prisma } from "./prisma";

export type AuditCategory =
  | "cms"
  | "admissions"
  | "attendance"
  | "fees"
  | "users"
  | "students"
  | "roles"
  | "settings"
  | "general";

export async function logAudit(
  req: Request | { user?: { sub: string; name: string } },
  params: { action: string; category: AuditCategory; entity?: string; entityId?: string; metadata?: unknown },
): Promise<void> {
  try {
    const actor = req.user;
    await prisma.auditLog.create({
      data: {
        userId: actor?.sub,
        actorName: actor?.name ?? "System",
        action: params.action,
        category: params.category,
        entity: params.entity,
        entityId: params.entityId,
        metadata: params.metadata ? (params.metadata as never) : undefined,
      },
    });
  } catch {
    // swallow -- never break the primary mutation
  }
}
