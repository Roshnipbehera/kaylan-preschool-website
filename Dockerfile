# Multi-stage build for the Next.js frontend (requires output: "standalone" in next.config.js)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
# app/api/health/route.ts -- basic liveness for the frontend container.
HEALTHCHECK --interval=10s --timeout=5s --retries=5 --start-period=15s \
  CMD wget -qO- http://localhost:3000/api/health || exit 1
CMD ["node", "server.js"]
