/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  setupFiles: ["<rootDir>/tests/setupEnv.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,
  verbose: true,
  // isolatedModules: transpile-only, skip full type-checking during the
  // Jest run itself. Real type-checking of test files is done separately
  // via `npm run typecheck:tests` (tsc -p tsconfig.test.json). This split
  // matters in this sandbox specifically because @prisma/client's generated
  // model-delegate types (prisma.user, prisma.message, etc.) require
  // `prisma generate` to reach binaries.prisma.sh, which is unreachable
  // here -- see backend/README/env notes on the documented Prisma-client-
  // generation limitation. Without isolatedModules, ts-jest would refuse to
  // run ANY test that references prismaMock.<model> because the stub
  // PrismaClient type has no model properties yet, even though the actual
  // JS logic under test is correct and runs fine. In a real environment
  // with `prisma generate` run against a reachable engine, this flag can be
  // removed to get full type-checking during `npm test` too.
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { isolatedModules: true }],
  },
};
