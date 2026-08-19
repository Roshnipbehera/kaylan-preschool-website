// Shared mocked Prisma client (jest-mock-extended's mockDeep) used by API
// tests so we can exercise real controller/middleware logic against
// supertest without a live Postgres connection. Import this file BEFORE
// importing anything that transitively imports "../src/lib/prisma"
// (e.g. src/app.ts) so the jest.mock registration below takes effect.
import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

jest.mock("../../src/lib/prisma", () => ({
  __esModule: true,
  prisma: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});
