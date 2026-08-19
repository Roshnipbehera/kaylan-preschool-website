// Single source of truth documenting the existing marketing-site palette
// and typography (defined physically in tailwind.config.ts / layout.tsx).
// This file does NOT change any existing component class names -- it exists
// so new code (auth pages, dashboards, ui/ components) references one
// place instead of re-hardcoding hex values, and so the palette is easy to
// extend consistently going forward.

export const colors = {
  sunshine: "#FFD93D",
  sky: "#6EC6FF",
  candy: "#FF8FB1",
  leaf: "#7ED957",
  orange: "#FFA552",
  lavender: "#CDB4FF",
  ink: "#3a2e4d",
} as const;

export const fonts = {
  display: "font-display", // Baloo 2 - headings/logo
  heading: "font-heading", // Fredoka - section titles
  body: "font-body", // Nunito - body copy
} as const;

export type ThemeColor = keyof typeof colors;
