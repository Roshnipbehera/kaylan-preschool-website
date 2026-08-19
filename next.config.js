const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const API_ORIGIN = (() => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return "http://localhost:4000";
  }
})();

// 'unsafe-eval' is required by Next.js dev mode's Fast Refresh/HMR runtime
// (webpack eval-based source maps). Not included in production builds --
// only when running `next dev` -- so production CSP hardening is unaffected.
const isDev = process.env.NODE_ENV !== "production";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://res.cloudinary.com https://images.unsplash.com",
  "font-src 'self' data:",
  `connect-src 'self' ${API_ORIGIN} ws: wss:`,
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
