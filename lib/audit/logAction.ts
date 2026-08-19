// Server-only helper for appending to the append-only audit log
// (data/audit/logs.json). Call from route handlers after a meaningful
// mutation succeeds. Mirrors the JSON-collection persistence pattern used
// throughout app/api/**/_store.ts.
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { AuditLogEntry, AuditCategory } from "@/lib/types/audit";

const DATA_DIR = path.join(process.cwd(), "data", "audit");
const LOGS_FILE = path.join(DATA_DIR, "logs.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readAuditLogs(): Promise<AuditLogEntry[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(LOGS_FILE, "utf-8");
    return JSON.parse(raw) as AuditLogEntry[];
  } catch {
    return [];
  }
}

export async function logAction(params: { actor: string; action: string; category: AuditCategory }): Promise<void> {
  try {
    const logs = await readAuditLogs();
    const entry: AuditLogEntry = {
      id: `log_${randomUUID()}`,
      actor: params.actor,
      action: params.action,
      category: params.category,
      createdAt: new Date().toISOString(),
    };
    logs.unshift(entry);
    await ensureDir();
    await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
  } catch {
    // Audit logging must never break the primary mutation; swallow errors.
  }
}
