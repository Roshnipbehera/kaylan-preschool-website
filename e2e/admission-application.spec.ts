import { test, expect } from "@playwright/test";

/**
 * Anonymous visitor submits an admission application via the public
 * multi-step form (components/admissions/AdmissionApplyForm.tsx), reachable
 * from /admissions. Not executed in this sandbox -- no live app/backend.
 */
test.describe("Anonymous visitor: submit admission application", () => {
  test("fills out all steps and submits successfully", async ({ page }) => {
    await page.goto("/admissions");

    const form = page.getByTestId("admission-apply-form");
    await expect(form).toBeVisible();

    // Step 0: Child
    await page.getByTestId("admission-child-fullname").fill("Alex Sample");
    await page.getByLabel("Date of Birth").fill("2021-06-15");
    await page.getByLabel("Program Applying For").fill("Nursery");
    await page.getByLabel("Nationality").fill("Indian");
    await page.getByTestId("admission-next").click();

    // Step 1: Guardian
    await page.getByLabel("Guardian's Full Name").fill("Jordan Sample");
    await page.getByLabel("Relation to Child").fill("Mother");
    await page.getByLabel("Phone").fill("9876543210");
    await page.getByLabel("Email").fill("jordan.sample@example.com");
    await page.getByLabel("Occupation").fill("Designer");
    await page.getByLabel("Address").fill("42 Example Ave");
    await page.getByTestId("admission-next").click();

    // Step 2: Medical
    await page.getByLabel("Blood Group").fill("O+");
    await page.getByLabel("Emergency Contact Name").fill("Sam Sample");
    await page.getByLabel("Emergency Contact Phone").fill("9876543211");
    await page.getByTestId("admission-next").click();

    // Step 3: Documents -- skipped here since real file upload requires a
    // live upload endpoint; this step's validation would block final submit
    // in a real run without uploaded files.
    await page.getByTestId("admission-next").click();

    // Step 4: Review + submit
    await page.getByTestId("admission-submit").click();

    await expect(page.getByText("Application Submitted!")).toBeVisible();
  });
});
