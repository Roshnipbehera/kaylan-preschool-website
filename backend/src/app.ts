import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { csrfProtection } from "./middleware/csrf";
import { requestLogger } from "./middleware/requestLogger";
import { prisma } from "./lib/prisma";

export function createApp() {
  const app = express();
  const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";

  // CSP allow-list mirrors next.config.js's images.remotePatterns (Cloudinary
  // + Unsplash) and the frontend/backend/Socket.io origins. connect-src needs
  // the API origin itself (frontend fetches) and ws(s):// for Socket.io.
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://images.unsplash.com"],
          fontSrc: ["'self'", "data:"],
          connectSrc: ["'self'", clientUrl, "ws:", "wss:"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          baseUri: ["'self'"],
        },
      },
    })
  );
  app.use(cors({ origin: clientUrl, credentials: true }));
  app.use(requestLogger);
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(csrfProtection);

  // Global rate limit as a baseline safety net; auth and message-send
  // routes layer their own tighter limiters on top (see authRoutes.ts,
  // messageRoutes.ts).
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 500,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  // Unauthenticated on purpose -- container orchestrators (Docker Compose
  // healthcheck, Kubernetes liveness/readiness probes) call this without a
  // JWT. Liveness (no query param) just confirms the process is up; a
  // deeper DB check (?deep=1, or always for the readiness-style checks
  // docker-compose uses) confirms Postgres is actually reachable via a
  // cheap `SELECT 1`, bounded by a short timeout so a hung DB doesn't hang
  // the health check itself.
  app.get("/health", async (_req, res) => {
    try {
      await Promise.race([
        prisma.$queryRaw`SELECT 1`,
        new Promise((_resolve, reject) => setTimeout(() => reject(new Error("DB health check timed out")), 2000)),
      ]);
      return res.status(200).json({ success: true, data: { status: "ok", db: "ok" } });
    } catch (err) {
      return res.status(503).json({
        success: false,
        data: { status: "degraded", db: "unreachable" },
        message: err instanceof Error ? err.message : "Health check failed",
      });
    }
  });
  app.use("/api/v1", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
