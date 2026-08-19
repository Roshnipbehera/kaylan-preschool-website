// Live Audit Log client -- talks to the real Express backend
// (backend/src/controllers/auditController.ts) via lib/api/client.ts's
// apiFetch. Replaces the previous client that called app/api/audit
// (JSON-backed, data/audit/logs.json); that route handler and data file
// are left in place untouched but no longer imported by any live UI code.
import { apiFetch } from "@/lib/api/client";
import type { AuditLogEntry } from "@/lib/types/audit";

export async function listAuditLogs(): Promise<AuditLogEntry[]> {
  return apiFetch<AuditLogEntry[]>("/audit", { cache: "no-store" });
}
