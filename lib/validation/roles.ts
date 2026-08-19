import { z } from "zod";

export const rolePermissionsSchema = z.array(
  z.object({
    role: z.enum(["parent", "teacher", "admin"]),
    permissions: z.array(z.string()),
  })
);

export type RolePermissionsFormValues = z.infer<typeof rolePermissionsSchema>;
