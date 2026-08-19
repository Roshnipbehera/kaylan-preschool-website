import type { RolePermissions } from "@/lib/types/roles";

async function parseJson<T>(res: Response): Promise<T> {
  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload || payload.success === false) {
    throw new Error(payload?.message ?? res.statusText ?? "Roles request failed");
  }
  return payload.data as T;
}

export async function listRolePermissions(): Promise<RolePermissions[]> {
  const res = await fetch(`/api/roles`, { cache: "no-store" });
  return parseJson<RolePermissions[]>(res);
}

export async function saveRolePermissions(input: RolePermissions[]): Promise<RolePermissions[]> {
  const res = await fetch(`/api/roles`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson<RolePermissions[]>(res);
}
