// Typed Downloads client. Talks to app/api/downloads route handler which
// reads from data/downloads/documents.json.
import type { DownloadDocument } from "@/lib/types/downloads";

async function parseJson<T>(res: Response): Promise<T> {
  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload || payload.success === false) {
    throw new Error(payload?.message ?? res.statusText ?? "Downloads request failed");
  }
  return payload.data as T;
}

export async function listDownloadDocuments(): Promise<DownloadDocument[]> {
  const res = await fetch("/api/downloads", { cache: "no-store" });
  return parseJson<DownloadDocument[]>(res);
}
