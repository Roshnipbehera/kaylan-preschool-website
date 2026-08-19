import { Request, Response } from "express";
import { requireAuth, requireRole } from "../../src/middleware/auth";
import { signAccessToken } from "../../src/utils/token";
import { AppError } from "../../src/middleware/errorHandler";

function mockReqRes(overrides: Partial<Request> = {}) {
  const req = { cookies: {}, headers: {}, ...overrides } as unknown as Request;
  const res = {} as Response;
  const next = jest.fn();
  return { req, res, next };
}

describe("middleware/auth", () => {
  const user = { id: "u1", role: "TEACHER" as const, email: "t@example.com", name: "Terry Teacher" };

  describe("requireAuth", () => {
    it("throws 401 AppError when no token is present", () => {
      const { req, res, next } = mockReqRes();
      expect(() => requireAuth(req, res, next)).toThrow(AppError);
      try {
        requireAuth(req, res, next);
      } catch (e) {
        expect((e as AppError).statusCode).toBe(401);
      }
      expect(next).not.toHaveBeenCalled();
    });

    it("accepts a valid cookie token and attaches req.user", () => {
      const token = signAccessToken(user);
      const { req, res, next } = mockReqRes({ cookies: { kaylan_access_token: token } } as any);
      requireAuth(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(req.user?.sub).toBe(user.id);
      expect(req.user?.role).toBe("teacher");
    });

    it("accepts a valid Bearer header token", () => {
      const token = signAccessToken(user);
      const { req, res, next } = mockReqRes({ headers: { authorization: `Bearer ${token}` } } as any);
      requireAuth(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(req.user?.sub).toBe(user.id);
    });

    it("throws 401 AppError for an invalid/expired token", () => {
      const { req, res, next } = mockReqRes({ cookies: { kaylan_access_token: "not-a-real-jwt" } } as any);
      expect(() => requireAuth(req, res, next)).toThrow(AppError);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("requireRole", () => {
    it("throws 401 if req.user is missing (auth not run first)", () => {
      const { req, res, next } = mockReqRes();
      const mw = requireRole("admin");
      expect(() => mw(req, res, next)).toThrow(AppError);
    });

    it("allows a matching role through", () => {
      const { req, res, next } = mockReqRes();
      req.user = { sub: "u1", role: "admin", email: "a@a.com", name: "Admin" };
      const mw = requireRole("admin", "teacher");
      mw(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("rejects a parent hitting an admin-only route with 403", () => {
      const { req, res, next } = mockReqRes();
      req.user = { sub: "u1", role: "parent", email: "p@p.com", name: "Parent" };
      const mw = requireRole("admin");
      let caught: unknown;
      try {
        mw(req, res, next);
      } catch (e) {
        caught = e;
      }
      expect(caught).toBeInstanceOf(AppError);
      expect((caught as AppError).statusCode).toBe(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
