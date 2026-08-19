// Structured logging via pino. Replaces ad-hoc console.log/console.error at
// the high-value spots (server bootstrap, request logging, global error
// handler, socket lifecycle) so production logs are machine-parseable
// (JSON lines) and carry consistent fields (level, msg, time, and
// request-scoped context like method/path/status/durationMs/userId).
//
// Deliberately NOT logged anywhere: passwords, JWTs/cookies, full request
// bodies. The request logger below only logs method/path/status/duration,
// never req.body or req.headers.
import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
  // Pretty-print in development for readability; plain JSON lines in
  // production (what log aggregators / `docker logs` / Kubernetes expect).
  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "HH:MM:ss", ignore: "pid,hostname" },
      },
  redact: {
    paths: ["req.headers.cookie", "req.headers.authorization", "password", "token", "*.password", "*.token"],
    censor: "[redacted]",
  },
});

export default logger;
