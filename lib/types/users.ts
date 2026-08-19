// Admin-managed user records. LIVE on the real backend as of this pass --
// backend/src/controllers/userController.ts's admin CRUD handlers, backed
// by Postgres User (+ Student.parentId for linkedStudentIds). The previous
// JSON-mock route handlers (app/api/users/**, data/users/users.json) are
// left in place untouched but are no longer imported by any live UI code.
import type { Role } from "@/lib/types/index";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  className?: string; // teachers
  subject?: string; // teachers
  linkedStudentIds?: string[]; // parents
  createdAt: string;
  updatedAt: string;
}

export type CreateUserInput = {
  name: string;
  email: string;
  role: Role;
  className?: string;
  subject?: string;
  linkedStudentIds?: string[];
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, "role">> & { isActive?: boolean };

// Returned only from createUser -- tempPassword is the server-generated,
// plaintext one-time password (hashed before storage). It is present ONLY
// in this response; ManagedUser as returned by every other endpoint never
// includes a password field.
export type CreateUserResult = ManagedUser & { tempPassword: string };
