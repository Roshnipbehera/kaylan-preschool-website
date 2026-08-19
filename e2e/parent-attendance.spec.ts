import { test, expect } from "@playwright/test";

/**
 * Parent logs in and views their child's attendance record.
 * Requires a running app + backend + seeded DB with the demo parent
 * account (parent@kaylan.school / password123, see LoginForm.tsx demo
 * credentials). Not executed in this sandbox -- no live DB/app available.
 */
test.describe("Parent: login + view child attendance", () => {
  test("logs in as a parent and sees the monthly attendance calendar", async ({ page }) => {
    await page.goto("/login");

    await page.getByTestId("login-role-parent").click();
    await page.getByTestId("login-email").fill("parent@kaylan.school");
    await page.getByTestId("login-password").fill("password123");
    await page.getByTestId("login-submit").click();

    await page.waitForURL(/\/parent/);

    await page.goto("/parent/attendance");
    await expect(page.getByTestId("parent-attendance-page")).toBeVisible();
    await expect(page.getByText("Monthly Summary")).toBeVisible();
    await expect(page.getByText("Attendance", { exact: false })).toBeVisible();
  });
});
