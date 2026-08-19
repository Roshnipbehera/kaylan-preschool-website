// Typed Progress Reports client. Talks to app/api/progress/** route
// handlers which persist to data/progress/reports.json.
import type { CreateProgressReportInput, ProgressReport } from "@/lib/types/progress";

async function parseJson<T>(res: Response): Promise<T> {
  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload || payload.success === false) {
    throw new Error(payload?.message ?? res.statusText ?? "Progress reports request failed");
  }
  return payload.data as T;
}

export async function listProgressReports(params?: { studentId?: string }): Promise<ProgressReport[]> {
  const qs = params?.studentId ? `?studentId=${encodeURIComponent(params.studentId)}` : "";
  const res = await fetch(`/api/progress${qs}`, { cache: "no-store" });
  return parseJson<ProgressReport[]>(res);
}

export async function createProgressReport(input: CreateProgressReportInput): Promise<ProgressReport> {
  const res = await fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson<ProgressReport>(res);
}

export async function deleteProgressReport(id: string): Promise<ProgressReport> {
  const res = await fetch(`/api/progress/${id}`, { method: "DELETE" });
  return parseJson<ProgressReport>(res);
}
