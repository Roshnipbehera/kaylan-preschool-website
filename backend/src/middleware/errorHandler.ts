import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";

export class AppError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, method: req.method, path: req.originalUrl }, err.message);
    }
    return res.status(err.statusCode).json({ success: false, message: err.message, code: err.code });
  }
  // Every controller validates req.body/req.query with schema.parse(...)
  // (not safeParse), which throws a raw ZodError on invalid input. Without
  // this branch that error fell through to the generic 500 case below,
  // which is wrong: malformed/incomplete client input is a 400, not a
  // server fault. Caught here (uncovered by the test suite added in this
  // pass -- see backend/tests/api/{auth,admissions}.api.test.ts) and fixed
  // as a small, additive correction; every route that calls schema.parse()
  // benefits without any per-controller change needed.
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    });
  }
  // Always log the full error server-side (with stack), regardless of what
  // the client response reveals. In production the client only ever sees
  // a generic message -- no stack trace / internal details leak out.
  logger.error({ err, method: req.method, path: req.originalUrl }, "Unhandled error");
  const isProduction = process.env.NODE_ENV === "production";
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(isProduction ? {} : { detail: err instanceof Error ? err.message : String(err) }),
  });
}
