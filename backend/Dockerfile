# Multi-stage build for the Express + Prisma + PostgreSQL + Socket.io backend.
FROM node:20-alpine AS deps
WORKDIR /app
# Prisma's query/schema engine binaries need OpenSSL, which the alpine base
# image doesn't include by default -- without this, Prisma silently falls
# back to guessing the OpenSSL version and can fail to load its engine at
# runtime ("[server] Failed to start" with no further detail).
RUN apk add --no-cache openssl
COPY package.json package-lock.json* ./
# Full install (incl. devDependencies) -- needed in this stage for `tsc` and
# `prisma generate` below. Pruned to production-only in the runner stage.
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generates the Prisma client (backend/prisma/schema.prisma) into
# node_modules/@prisma/client before compiling, since controllers import it
# directly. Requires network access to fetch the Prisma engine binaries --
# fine in a real build environment with internet; not exercised in this
# project's sandbox passes (see README/CI notes).
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
# Non-root user for the running container.
RUN addgroup -S nodejs && adduser -S expressjs -G nodejs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/package-lock.json* ./
COPY --from=builder /app/prisma ./prisma
# Production-only node_modules, including the already-generated Prisma
# client (generated into node_modules/@prisma/client above, so it ships
# without needing network access again at runtime).
RUN npm install --omit=dev && npx prisma generate
USER expressjs
EXPOSE 4000
# Unauthenticated GET /health (see src/app.ts) used by the docker-compose
# healthcheck directive and any container-orchestrator liveness/readiness
# probe.
HEALTHCHECK --interval=10s --timeout=5s --retries=5 --start-period=15s \
  CMD wget -qO- http://localhost:4000/health || exit 1
CMD ["node", "dist/server.js"]
