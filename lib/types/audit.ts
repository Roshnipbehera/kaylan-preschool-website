export type AuditCategory = "cms" | "admissions" | "attendance" | "fees" | "users" | "students" | "roles" | "settings";

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  category: AuditCategory;
  createdAt: string;
}
