// SUPERSEDED as of the Prisma+Express+Socket.io migration: there never was
// a `server.js` custom Next.js server in this repo (dev/start scripts run
// plain `next dev` / `next start`), so this file was unused scaffold from
// an earlier, interrupted attempt at wiring Socket.io directly into
// Next.js. The live Socket.io server now runs as part of the dedicated
// backend/ Express service (backend/src/socket/index.ts), which is the
// cleaner place for it anyway. Left in place, untouched, in case any other
// scaffold code still imports it; new code should use lib/socket/client.ts
// (the browser-side socket.io-client connecting to that backend) instead.
// `socket.io` (the server package) was never a frontend dependency -- it
// only ever belongs in backend/ (see backend/src/socket/index.ts, which
// has its own, fully-typed `getIO()`). Typed as `unknown` here rather than
// importing the server package into the Next.js app just for a dead file.
declare global {
  // eslint-disable-next-line no-var
  var __kaylanIo: unknown;
}

export function setIO(io: unknown): void {
  globalThis.__kaylanIo = io;
}

export function getIO(): unknown {
  return globalThis.__kaylanIo;
}

export function conversationRoom(conversationId: string): string {
  return `conversation:${conversationId}`;
}
