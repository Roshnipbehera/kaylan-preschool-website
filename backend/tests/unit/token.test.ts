import { signAccessToken, verifyAccessToken, hashToken, generateRefreshToken, generateRandomToken, toJwtRole } from "../../src/utils/token";

describe("utils/token", () => {
  const fakeUser = { id: "user_1", role: "PARENT" as const, email: "parent@example.com", name: "Pat Parent" };

  it("signs and verifies an access token round-trip", () => {
    const token = signAccessToken(fakeUser);
    expect(typeof token).toBe("string");
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe(fakeUser.id);
    expect(payload.role).toBe("parent");
    expect(payload.email).toBe(fakeUser.email);
    expect(payload.name).toBe(fakeUser.name);
  });

  it("rejects a tampered/invalid token", () => {
    const token = signAccessToken(fakeUser);
    expect(() => verifyAccessToken(token + "tampered")).toThrow();
  });

  it("rejects a token signed with a different secret", () => {
    const jwt = require("jsonwebtoken");
    const bogus = jwt.sign({ sub: "x", role: "parent", email: "a@b.com", name: "A" }, "wrong-secret");
    expect(() => verifyAccessToken(bogus)).toThrow();
  });

  it("lowercases Prisma UserRole to the JWT role claim", () => {
    expect(toJwtRole("ADMIN")).toBe("admin");
    expect(toJwtRole("TEACHER")).toBe("teacher");
  });

  it("hashToken is deterministic and one-way (not equal to input)", () => {
    const raw = generateRefreshToken();
    const h1 = hashToken(raw);
    const h2 = hashToken(raw);
    expect(h1).toBe(h2);
    expect(h1).not.toBe(raw);
    expect(h1).toHaveLength(64); // sha256 hex
  });

  it("generateRefreshToken/generateRandomToken produce sufficiently random, distinct values", () => {
    const a = generateRefreshToken();
    const b = generateRefreshToken();
    expect(a).not.toBe(b);
    expect(a).toHaveLength(96); // 48 bytes hex
    const r1 = generateRandomToken();
    const r2 = generateRandomToken();
    expect(r1).not.toBe(r2);
  });
});
