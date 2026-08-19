import { test, expect } from "@playwright/test";

/**
 * Teacher logs in and marks attendance for their class.
 * Requires a running app + backend + seeded DB with the demo teacher
 * account (teacher@kaylan.school / password123). Not executed in this
 * sandbox -- no live DB/app available.
 */
test.describe("Teacher: mark attendance for their class", () => {
  test("marks the first student present and saves", async ({ page }) => {
    await page.goto("/login");

    await page.getByTestId("login-role-teacher").click();
    await page.getByTestId("login-email").fill("teacher@kaylan.school");
    await page.getByTestId("login-password").fill("password123");
    await page.getByTestId("login-submit").click();

    await page.waitForURL(/\/teacher/);

    await page.goto("/teacher/attendance");
    await expect(page.getByText("Mark Attendance")).toBeVisible();

    const firstRow = page.locator('[data-testid^="attendance-row-"]').first();
    await expect(firstRow).toBeVisible();

    const rowTestId = await firstRow.getAttribute("data-testid");
    const studentId = rowTestId!.replace("attendance-row-", "");

    await page.getByTestId(`attendance-status-${studentId}-present`).click();
    await page.getByTestId("attendance-save").click();

    await expect(page.getByText(/Attendance saved for/i)).toBeVisible();
  });
});
