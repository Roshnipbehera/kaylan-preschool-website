import { test, expect } from "@playwright/test";

test.describe("QA Verification Suite", () => {
  test("1. Nav and footer links return 200 pages", async ({ page, request, baseURL }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Gather unique internal links from nav and footer
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll("header nav a, footer a")) as HTMLAnchorElement[];
      const hrefs = anchors
        .map((a) => a.getAttribute("href"))
        .filter((href): href is string => Boolean(href && href.startsWith("/") && !href.startsWith("//")));
      return Array.from(new Set(hrefs));
    });

    expect(links.length).toBeGreaterThan(5);

    for (const href of links) {
      const response = await request.get(new URL(href, baseURL).toString());
      expect(response.status(), `Link ${href} should return 200`).toBe(200);
    }
  });

  test("2. /admissions/apply renders application form and /login renders fields", async ({ page }) => {
    // Check /admissions/apply
    await page.goto("/admissions/apply", { waitUntil: "domcontentloaded" });
    const childNameInput = page.locator('input[name="child.fullName"]');
    await expect(childNameInput).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Loading application form...")).not.toBeVisible();

    // Check /login
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    await expect(emailInput).toBeVisible({ timeout: 10_000 });
    await expect(passwordInput).toBeVisible({ timeout: 10_000 });

    // Role switcher tabs
    await expect(page.getByRole("tab", { name: "Parent" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Teacher" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Admin" })).toBeVisible();
  });

  test("3. Each page has a unique canonical URL matching its own path", async ({ page, baseURL }) => {
    const pagesToCheck = [
      { path: "/" },
      { path: "/about" },
      { path: "/programs" },
      { path: "/curriculum" },
      { path: "/facilities" },
      { path: "/gallery" },
      { path: "/admissions/apply" },
      { path: "/contact" },
      { path: "/events" },
      { path: "/careers" },
      { path: "/blog" },
      { path: "/login" },
      { path: "/blog/building-early-confidence-through-play" },
    ];

    const observedCanonicals = new Set<string>();

    for (const item of pagesToCheck) {
      await page.goto(item.path, { waitUntil: "domcontentloaded" });
      const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonicalHref, `Canonical tag missing on ${item.path}`).toBeTruthy();

      const parsedUrl = new URL(canonicalHref!, baseURL || "https://kaylan-preschool-website.vercel.app");
      expect(parsedUrl.pathname, `Canonical pathname on ${item.path} should match`).toBe(item.path);

      observedCanonicals.add(canonicalHref!);
    }

    // Ensure all 13 checked pages have distinct canonical URLs
    expect(observedCanonicals.size).toBe(pagesToCheck.length);
  });

  test("4. Events page shows no past events under 'All Upcoming Events'", async ({ page }) => {
    await page.goto("/events", { waitUntil: "domcontentloaded" });

    const upcomingHeading = page.getByRole("heading", { name: "All Upcoming Events" });
    await expect(upcomingHeading).toBeVisible();

    // Check that Aug 15, Aug 22, and Sep 5 past events are NOT under the upcoming list
    const upcomingContainer = page.locator("div.space-y-4").first();
    const upcomingText = await upcomingContainer.innerText();

    expect(upcomingText).not.toContain("Admission Open House");
    expect(upcomingText).not.toContain("Annual Sports Day");
    expect(upcomingText).not.toContain("Parent-Teacher Meet");

    // The future Diwali event should be upcoming
    expect(upcomingText).toContain("Diwali Celebration");

    // Past events should be in the collapsed details
    const pastDetails = page.locator("details");
    if (await pastDetails.count() > 0) {
      const summaryText = await pastDetails.locator("summary").innerText();
      expect(summaryText.toLowerCase()).toContain("past events");
    }
  });

  test("5. Homepage anchors (#contact, #admissions, #visit-form) resolve to real elements", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const contactEl = page.locator("#contact");
    const admissionsEl = page.locator("#admissions");
    const visitFormEl = page.locator("#visit-form");

    await expect(contactEl).toBeAttached();
    await expect(admissionsEl).toBeAttached();
    await expect(visitFormEl).toBeAttached();
  });

  test("6. Enquiry form validates required fields without submitting real data", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const form = page.locator("#visit-form");
    await expect(form).toBeVisible();

    const submitBtn = form.locator('button[type="submit"]');
    await submitBtn.click();

    // Required validation errors should show up
    await expect(page.getByText(/Please enter your name/i).or(page.getByText(/Name is required/i))).toBeVisible();
  });

  test("7. Site has no horizontal scroll at 375px width", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const pages = ["/", "/about", "/programs", "/curriculum", "/facilities", "/gallery", "/contact", "/events", "/blog"];

    for (const p of pages) {
      await page.goto(p, { waitUntil: "domcontentloaded" });

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll, `Page ${p} has horizontal scroll at 375px`).toBe(false);
    }
  });
});
