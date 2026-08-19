import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";

// Lightweight structured request logger: method/path/status/duration only.
// Deliberately never logs req.body, req.headers, or query params, since
// those can carry PII, passwords, or auth tokens (see errorHandler.ts and
// authController.ts for what shapes cross this app -- login credentials,
// message content, etc). Skips /health so orchestrator polling (Docker
// Compose healthcheck, k8s liveness/readiness probes) doesn't spam logs.
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  if (req.path === "/health" || req.path === "/healthz") return next();

  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const meta = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
      userId: (req as Request & { user?: { sub?: string } }).user?.sub,
    };
    if (res.statusCode >= 500) logger.error(meta, "request completed with server error");
    else if (res.statusCode >= 400) logger.warn(meta, "request completed with client error");
    else logger.info(meta, "request completed");
  });
  next();
}
