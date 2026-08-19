import { NextResponse } from "next/server";

// Basic liveness probe for the frontend container -- confirms the Next.js
// server process is up and able to handle a request. Deliberately no
// downstream dependency checks (that's backend GET /health's job); keeps
// this container's own docker-compose healthcheck fast and independent of
// backend availability.
export async function GET() {
  return NextResponse.json({ success: true, data: { status: "ok" } }, { status: 200 });
}
