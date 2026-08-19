"use client";

// Real permission gating: fetches the persisted role -> permission-key
// matrix (data/roles/roles.json via /api/roles) and exposes a `can(key)`
// check for the current user's role. Used by AdminSubNav to actually hide
// nav items an admin's role hasn't been granted, demonstrating the
// Role Management / Permissions feature is consulted, not decorative.
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/hooks/useAuth";
import { listRolePermissions } from "@/lib/api/roles";
import { queryKeys } from "@/lib/query/keys";
import type { PermissionKey } from "@/lib/types/roles";

export function usePermissions() {
  const { role } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.rolePermissions,
    queryFn: listRolePermissions,
  });

  const permissions = data?.find((r) => r.role === role)?.permissions ?? [];

  const can = (key: PermissionKey) => permissions.includes(key);

  return { permissions, can, isLoading };
}
