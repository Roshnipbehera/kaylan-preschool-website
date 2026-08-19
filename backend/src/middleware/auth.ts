import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler";
import { verifyAccessToken, ACCESS_COOKIE_NAME, type AccessTokenPayload, type JwtRole } from "../utils/token";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[ACCESS_COOKIE_NAME] ?? req.headers.authorization?.replace("Bearer ", "");
  if (!token) throw new AppError("Not authenticated", 401);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    throw new AppError("Invalid or expired access token", 401);
  }
}

export function requireRole(...roles: JwtRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Not authenticated", 401);
    if (!roles.includes(req.user.role)) throw new AppError("Forbidden: insufficient role", 403);
    next();
  };
}
