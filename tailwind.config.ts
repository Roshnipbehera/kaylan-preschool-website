import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sunshine: "#F5A623",
        sky: "#6EC6FF",
        candy: "#0F6B66",
        leaf: "#7ED957",
        orange: "#FFA552",
        lavender: "#CDB4FF",
        // Kaylan brand reference colors (school-bag mockup, Phase 7).
        // Added additively -- existing pastel palette above is left in
        // place since it is used throughout every existing component;
        // these tokens are available for any new/updated brand-forward
        // elements (e.g. logo wordmark, primary CTAs) without a full
        // site-wide recolor. See PHASE7_REPORT.md for the full rationale.
        brandTeal: "#0F6B66",
        brandTealLight: "#128C82",
        brandGold: "#F5A623",
        brandGoldLight: "#FFB733",
      },
      fontFamily: {
        display: ["var(--font-outfit)", "var(--font-fredoka)", "sans-serif"],
        heading: ["var(--font-fredoka)", "var(--font-outfit)", "sans-serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(3deg)" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        driftX: {
          "0%": { transform: "translateX(-10vw)" },
          "100%": { transform: "translateX(110vw)" },
        },
        sparkle: {
          "0%,100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        bob: {
          "0%,100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-10px) rotate(2deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        floatSlow: "floatSlow 8s ease-in-out infinite",
        driftX: "driftX 30s linear infinite",
        sparkle: "sparkle 2s ease-in-out infinite",
        wiggle: "wiggle 3s ease-in-out infinite",
        bob: "bob 4s ease-in-out infinite",
      },
      borderRadius: {
        blob: "60% 40% 55% 45% / 45% 55% 45% 55%",
      },
    },
  },
  plugins: [],
};
export default config;
