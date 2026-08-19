import type { Role } from "@/lib/types/index";

export const PERMISSION_KEYS = [
  "manage_students",
  "manage_fees",
  "publish_blog",
  "manage_gallery",
  "manage_events",
  "manage_cms",
  "view_analytics",
  "manage_users",
  "manage_roles",
  "view_audit_logs",
  "manage_settings",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export interface RolePermissions {
  role: Role;
  permissions: PermissionKey[];
}
