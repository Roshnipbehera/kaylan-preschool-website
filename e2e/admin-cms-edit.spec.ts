import { test, expect } from "@playwright/test";

/**
 * Admin edits a CMS section (About) via the generic CmsSectionEditor form
 * (components/admin/CmsSectionEditor.tsx), reachable from
 * /admin/cms/[section]. Requires a running app + backend + seeded DB with
 * the demo admin account (admin@kaylan.school / password123). Not executed
 * in this sandbox -- no live DB/app available.
 */
test.describe("Admin: edit a CMS section", () => {
  test("edits the About section heading and saves", async ({ page }) => {
    await page.goto("/login");

    await page.getByTestId("login-role-admin").click();
    await page.getByTestId("login-email").fill("admin@kaylan.school");
    await page.getByTestId("login-password").fill("password123");
    await page.getByTestId("login-submit").click();

    await page.waitForURL(/\/admin/);

    await page.goto("/admin/cms/about");
    const form = page.getByTestId("cms-section-editor-form");
    await expect(form).toBeVisible();

    const headingInput = page.getByLabel("heading", { exact: false }).first();
    await headingInput.fill("Updated About Heading");

    await page.getByTestId("cms-save-changes").click();

    await expect(page.getByText(/Content saved/i)).toBeVisible();
  });
});
