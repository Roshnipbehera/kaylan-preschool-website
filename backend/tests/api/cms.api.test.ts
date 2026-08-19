import { prismaMock } from "../helpers/prismaMock";
import request from "supertest";
import { createApp } from "../../src/app";
import { signAccessToken } from "../../src/utils/token";

const app = createApp();

// PUT is a mutating method and /api/v1/cms/:sectionKey is NOT in the CSRF
// double-submit-cookie exempt list (see src/middleware/csrf.ts), so every
// PUT request below must carry a CSRF cookie and a matching x-csrf-token
// header, exactly like a real browser session that already received the
// cookie from a prior response would.
const CSRF_TOKEN = "test-csrf-token-0123456789";

function cookies(accessToken?: string) {
  const list = [`kaylan_csrf_token=${CSRF_TOKEN}`];
  if (accessToken) list.push(`kaylan_access_token=${accessToken}`);
  return list;
}

function fakeSection(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "sec_1",
    sectionKey: "hero",
    contentJson: { headline: "Welcome to Kaylan Preschool" },
    updatedAt: new Date(),
    updatedByUserId: null,
    ...overrides,
  };
}

describe("GET /api/v1/cms/:sectionKey (public)", () => {
  it("returns the section content without any auth", async () => {
    prismaMock.cmsSection.findUnique.mockResolvedValue(fakeSection() as any);
    const res = await request(app).get("/api/v1/cms/hero");
    expect(res.status).toBe(200);
    expect(res.body.data.headline).toBe("Welcome to Kaylan Preschool");
  });

  it("returns 404 for an unknown section", async () => {
    prismaMock.cmsSection.findUnique.mockResolvedValue(null);
    const res = await request(app).get("/api/v1/cms/does-not-exist");
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/v1/cms/:sectionKey (admin-only)", () => {
  it("returns 401 with no auth token (still carries a valid CSRF pair)", async () => {
    const res = await request(app).put("/api/v1/cms/hero").set("Cookie", cookies()).set("x-csrf-token", CSRF_TOKEN).send({ headline: "New" });
    expect(res.status).toBe(401);
  });

  it("returns 403 for a non-admin (teacher) token", async () => {
    const token = signAccessToken({ id: "u1", role: "TEACHER", email: "t@t.com", name: "T" });
    const res = await request(app)
      .put("/api/v1/cms/hero")
      .set("Cookie", cookies(token))
      .set("x-csrf-token", CSRF_TOKEN)
      .send({ headline: "New" });
    expect(res.status).toBe(403);
  });

  it("returns 403 when the CSRF header is missing on an authenticated admin request", async () => {
    const token = signAccessToken({ id: "admin_1", role: "ADMIN", email: "a@a.com", name: "A" });
    const res = await request(app).put("/api/v1/cms/hero").set("Cookie", cookies(token)).send({ headline: "New" });
    expect(res.status).toBe(403);
    expect(prismaMock.cmsSection.upsert).not.toHaveBeenCalled();
  });

  it("allows an admin with a valid CSRF pair to upsert section content", async () => {
    const token = signAccessToken({ id: "admin_1", role: "ADMIN", email: "a@a.com", name: "A" });
    prismaMock.cmsSection.upsert.mockResolvedValue(fakeSection({ contentJson: { headline: "Updated!" } }) as any);

    const res = await request(app)
      .put("/api/v1/cms/hero")
      .set("Cookie", cookies(token))
      .set("x-csrf-token", CSRF_TOKEN)
      .send({ headline: "Updated!" });

    expect(res.status).toBe(200);
    expect(res.body.data.headline).toBe("Updated!");
    expect(prismaMock.cmsSection.upsert).toHaveBeenCalledTimes(1);
  });
});
