import { describe, it, expect } from "vitest";
import { loginSchema, resetPasswordSchema, profileSchema } from "@/lib/validation/schemas";

describe("auth/profile validation schemas", () => {
  describe("loginSchema", () => {
    it("accepts a valid login payload", () => {
      const result = loginSchema.safeParse({
        email: "parent@example.com",
        password: "secret123",
        role: "parent",
      });
      expect(result.success).toBe(true);
    });

    it("rejects a password shorter than 6 characters", () => {
      const result = loginSchema.safeParse({
        email: "parent@example.com",
        password: "abc",
        role: "parent",
      });
      expect(result.success).toBe(false);
    });

    it("rejects a role outside the allowed enum", () => {
      const result = loginSchema.safeParse({
        email: "parent@example.com",
        password: "secret123",
        role: "superadmin",
      });
      expect(result.success).toBe(false);
    });

    it("rejects a malformed email", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "secret123",
        role: "teacher",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("accepts matching passwords", () => {
      const result = resetPasswordSchema.safeParse({
        password: "newpass1",
        confirmPassword: "newpass1",
      });
      expect(result.success).toBe(true);
    });

    it("rejects mismatched passwords with an error on confirmPassword", () => {
      const result = resetPasswordSchema.safeParse({
        password: "newpass1",
        confirmPassword: "different",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
      }
    });
  });

  describe("profileSchema", () => {
    it("accepts a valid profile with no phone", () => {
      const result = profileSchema.safeParse({ name: "Jane Doe", email: "jane@example.com" });
      expect(result.success).toBe(true);
    });

    it("rejects an invalid phone number format", () => {
      const result = profileSchema.safeParse({
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "not-a-phone!!",
      });
      expect(result.success).toBe(false);
    });

    it("rejects a name that is too short", () => {
      const result = profileSchema.safeParse({ name: "J", email: "jane@example.com" });
      expect(result.success).toBe(false);
    });
  });
});
