"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listRolePermissions, saveRolePermissions } from "@/lib/api/roles";
import { queryKeys } from "@/lib/query/keys";
import { useToast } from "@/lib/hooks/useToast";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { PERMISSION_KEYS } from "@/lib/types/roles";
import type { PermissionKey, RolePermissions } from "@/lib/types/roles";
import type { Role } from "@/lib/types/index";

const ROLE_LABELS: Record<Role, string> = { admin: "Admin", teacher: "Teacher", parent: "Parent" };

export function AdminRolesContent() {
  const toast = useToast();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: queryKeys.rolePermissions, queryFn: listRolePermissions });
  const [local, setLocal] = useState<RolePermissions[]>([]);

  useEffect(() => {
    if (data) setLocal(data);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload: RolePermissions[]) => saveRolePermissions(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.rolePermissions });
      toast.success("Role permissions saved.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to save permissions"),
  });

  const toggle = (role: Role, key: PermissionKey) => {
    setLocal((prev) =>
      prev.map((r) =>
        r.role === role
          ? { ...r, permissions: r.permissions.includes(key) ? r.permissions.filter((p) => p !== key) : [...r.permissions, key] }
          : r
      )
    );
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Roles &amp; Permissions</h1>
        <Button onClick={() => saveMutation.mutate(local)} isLoading={saveMutation.isPending}>
          Save Changes
        </Button>
      </div>
      <p className="mb-4 text-sm text-[#3a2e4d]/60">
        Toggle which permission keys each role is granted. This directly gates which sections of the Admin sidebar are visible to a
        signed-in user (see components/admin/AdminSubNav.tsx), so unchecking a permission here removes that section from the nav for
        that role in real time.
      </p>
      <div className="grid gap-6 sm:grid-cols-3">
        {local.map((r) => (
          <Card key={r.role}>
            <CardHeader>
              <CardTitle>{ROLE_LABELS[r.role]}</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {PERMISSION_KEYS.map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm text-[#3a2e4d]/80">
                  <input type="checkbox" checked={r.permissions.includes(key)} onChange={() => toggle(r.role, key)} />
                  {key.replace(/_/g, " ")}
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
