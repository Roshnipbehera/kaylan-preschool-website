// Singleton Prisma client. Reused across the app and the socket layer so
// there is exactly one connection pool per process.
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __kaylanPrisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__kaylanPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__kaylanPrisma = prisma;
}
