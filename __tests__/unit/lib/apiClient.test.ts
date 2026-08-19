import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch, ApiError } from "@/lib/api/client";

describe("apiFetch", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    document.cookie = "kaylan_csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns payload.data on a successful (2xx) response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({ success: true, data: { id: "1", name: "hi" } }),
    }) as unknown as typeof fetch;

    const result = await apiFetch<{ id: string; name: string }>("/some/path");
    expect(result).toEqual({ id: "1", name: "hi" });
  });

  it("throws an ApiError with the response status on a non-2xx response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ success: false, message: "Not found" }),
    }) as unknown as typeof fetch;

    await expect(apiFetch("/missing")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      message: "Not found",
    });
  });

  it("wraps a network failure (fetch rejecting) in an ApiError with status 0", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down")) as unknown as typeof fetch;

    let caught: unknown;
    try {
      await apiFetch("/anything");
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    expect((caught as ApiError).status).toBe(0);
    expect((caught as ApiError).message).toBe("network down");
  });

  it("does not attach the CSRF header on a safe GET request", async () => {
    document.cookie = "kaylan_csrf_token=abc123";
    let capturedHeaders: Record<string, string> | undefined;
    global.fetch = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
      capturedHeaders = init.headers as Record<string, string>;
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({ success: true, data: null }),
      });
    }) as unknown as typeof fetch;

    await apiFetch("/safe", { method: "GET" });
    expect(capturedHeaders?.["x-csrf-token"]).toBeUndefined();
  });

  it("attaches the CSRF header (read from the cookie) on a mutating POST request", async () => {
    document.cookie = "kaylan_csrf_token=abc123";
    let capturedHeaders: Record<string, string> | undefined;
    global.fetch = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
      capturedHeaders = init.headers as Record<string, string>;
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({ success: true, data: null }),
      });
    }) as unknown as typeof fetch;

    await apiFetch("/mutate", { method: "POST", json: { foo: "bar" } });
    expect(capturedHeaders?.["x-csrf-token"]).toBe("abc123");
  });

  it("omits the CSRF header on a mutating request when no cookie is present", async () => {
    let capturedHeaders: Record<string, string> | undefined;
    global.fetch = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
      capturedHeaders = init.headers as Record<string, string>;
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({ success: true, data: null }),
      });
    }) as unknown as typeof fetch;

    await apiFetch("/mutate", { method: "PUT", json: { foo: "bar" } });
    expect(capturedHeaders?.["x-csrf-token"]).toBeUndefined();
  });
});
