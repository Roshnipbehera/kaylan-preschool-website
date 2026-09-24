import { Request, Response } from "express";
import { csrfProtection, CSRF_COOKIE_NAME, CSRF_HEADER_NAME, generateCsrfToken } from "../../src/middleware/csrf";
import { AppError } from "../../src/middleware/errorHandler";

function mockReqRes(method: string, opts: { cookieToken?: string; headerToken?: string; path?: string } = {}) {
  const cookies: Record<string, string> = {};
  if (opts.cookieToken) cookies[CSRF_COOKIE_NAME] = opts.cookieToken;
  const headers: Record<string, string> = {};
  if (opts.headerToken) headers[CSRF_HEADER_NAME] = opts.headerToken;

  const req = { method, cookies, headers, path: opts.path ?? "/api/v1/students" } as unknown as Request;
  const res = { cookie: jest.fn() } as unknown as Response;
  const next = jest.fn();
  return { req, res, next };
}

describe("middleware/csrf", () => {
  it("lets a safe GET request through even without a token", () => {
    const { req, res, next } = mockReqRes("GET");
    csrfProtection(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("issues a fresh CSRF cookie when none is present yet", () => {
    const { req, res, next } = mockReqRes("GET");
    csrfProtection(req, res, next);
    expect(res.cookie).toHaveBeenCalledWith(CSRF_COOKIE_NAME, expect.any(String), expect.any(Object));
  });

  it("allows a mutating request whose header matches the cookie", () => {
    const token = generateCsrfToken();
    const { req, res, next } = mockReqRes("POST", { cookieToken: token, headerToken: token });
    csrfProtection(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects a mutating request with a missing header", () => {
    const token = generateCsrfToken();
    const { req, res, next } = mockReqRes("POST", { cookieToken: token });
    expect(() => csrfProtection(req, res, next)).toThrow(AppError);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects a mutating request whose header does not match the cookie", () => {
    const { req, res, next } = mockReqRes("PUT", { cookieToken: generateCsrfToken(), headerToken: generateCsrfToken() });
    let caught: unknown;
    try {
      csrfProtection(req, res, next);
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(AppError);
    expect((caught as AppError).statusCode).toBe(403);
  });

  it("exempts /api/v1/auth/login from the header check", () => {
    const { req, res, next } = mockReqRes("POST", { cookieToken: generateCsrfToken(), path: "/api/v1/auth/login" });
    csrfProtection(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("exempts /api/v1/contact from the header check for public visitors", () => {
    const { req, res, next } = mockReqRes("POST", { cookieToken: generateCsrfToken(), path: "/api/v1/contact" });
    csrfProtection(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("exempts /api/v1/events/:id/rsvp from the header check for public visitors", () => {
    const { req, res, next } = mockReqRes("POST", { cookieToken: generateCsrfToken(), path: "/api/v1/events/evt_123/rsvp" });
    csrfProtection(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
