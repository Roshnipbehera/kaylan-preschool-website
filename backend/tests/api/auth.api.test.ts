import { prismaMock } from "../helpers/prismaMock";
import request from "supertest";
import bcrypt from "bcryptjs";
import { createApp } from "../../src/app";
import { signAccessToken } from "../../src/utils/token";

jest.mock("../../src/config/nodemailer", () => ({
  sendMail: jest.fn().mockResolvedValue(undefined),
  verificationEmailTemplate: jest.fn().mockReturnValue("<p>verify</p>"),
  passwordResetEmailTemplate: jest.fn().mockReturnValue("<p>reset</p>"),
}));

const app = createApp();

function fakeUser(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "user_1",
    name: "Pat Parent",
    email: "parent@example.com",
    passwordHash: bcrypt.hashSync("correct-horse-battery", 10),
    role: "PARENT",
    isEmailVerified: true,
    avatarUrl: null,
    createdAt: new Date(),
    ...overrides,
  };
}

describe("POST /api/v1/auth/login", () => {
  it("logs in with correct credentials and sets cookies", async () => {
    prismaMock.user.findUnique.mockResolvedValue(fakeUser() as any);
    prismaMock.refreshToken.create.mockResolvedValue({} as any);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "parent@example.com", password: "correct-horse-battery", role: "parent" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("parent@example.com");
    expect(res.body.data.token).toEqual(expect.any(String));
    const setCookie = res.headers["set-cookie"] as unknown as string[];
    expect(setCookie.some((c) => c.startsWith("kaylan_access_token="))).toBe(true);
    expect(setCookie.some((c) => c.startsWith("kaylan_refresh_token="))).toBe(true);
  });

  it("rejects an incorrect password with 401", async () => {
    prismaMock.user.findUnique.mockResolvedValue(fakeUser() as any);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "parent@example.com", password: "wrong-password", role: "parent" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("rejects a login attempt for a nonexistent user with 401", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "ghost@example.com", password: "whatever1", role: "parent" });

    expect(res.status).toBe(401);
  });

  it("rejects when the role does not match the stored account role", async () => {
    prismaMock.user.findUnique.mockResolvedValue(fakeUser({ role: "TEACHER" }) as any);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "parent@example.com", password: "correct-horse-battery", role: "parent" });

    expect(res.status).toBe(401);
  });

  it("rejects malformed input (bad email) with a validation error before hitting the DB", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "not-an-email", password: "x", role: "parent" });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });
});

describe("Protected routes via requireAuth/requireRole (exercised through the real app + a live route)", () => {
  it("returns 401 hitting a protected route (/api/v1/users) with no token", async () => {
    const res = await request(app).get("/api/v1/users");
    expect(res.status).toBe(401);
  });

  it("returns 403 hitting an admin-only route as a parent", async () => {
    const token = signAccessToken({ id: "u1", role: "PARENT", email: "p@p.com", name: "P" });
    prismaMock.user.findMany.mockResolvedValue([]);

    const res = await request(app).get("/api/v1/users").set("Cookie", [`kaylan_access_token=${token}`]);
    expect(res.status).toBe(403);
  });
});

describe("GET /api/v1/auth/me", () => {
  it("returns the authenticated user's profile", async () => {
    const token = signAccessToken({ id: "user_1", role: "PARENT", email: "parent@example.com", name: "Pat Parent" });
    prismaMock.user.findUnique.mockResolvedValue(fakeUser() as any);

    const res = await request(app).get("/api/v1/auth/me").set("Cookie", [`kaylan_access_token=${token}`]);
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe("parent");
  });

  it("returns 401 without a token", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
  });
});
