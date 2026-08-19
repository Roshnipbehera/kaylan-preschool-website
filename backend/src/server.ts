import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { validateEnv } from "./config/env";
import { createApp } from "./app";
import { initSocket } from "./socket";
import { prisma } from "./lib/prisma";
import { logger } from "./config/logger";

// Fail fast on missing/invalid env vars, before anything else touches
// process.env (JWT signing, Cloudinary config, nodemailer transport, etc).
validateEnv();

const PORT = process.env.PORT ?? 4000;

async function main() {
  // Fail fast if Postgres (Auth + Messaging's live datastore) is not
  // reachable -- prefer a clear boot-time error over confusing 500s later.
  await prisma.$connect();
  logger.info("[server] Postgres connection established");

  const app = createApp();
  const server = http.createServer(app);
  initSocket(server);
  logger.info("[server] Socket.io attached");

  server.listen(PORT, () => {
    logger.info({ port: PORT }, "Kaylan Preschool API + Socket.io listening");
  });
}

main().catch((err) => {
  logger.error({ err }, "[server] Failed to start");
  process.exit(1);
});
