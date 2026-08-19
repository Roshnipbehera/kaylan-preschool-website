import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E config. These tests exercise real, logged-in user flows
 * against a running instance of the app (`npm run dev`) + a live backend/DB
 * (see backend/README / docker-compose.yml). They are NOT run as part of
 * `npm test` (that's vitest, unit/component only) -- run them explicitly
 * with `npm run test:e2e` once a full stack is available.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
