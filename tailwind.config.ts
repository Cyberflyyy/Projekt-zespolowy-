import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // Developer-minimal neutral palette (matches --kp-* tokens)
        canvas:  "#FFFFFF",
        surface: "#F4F4F8",
        sunken:  "#EEEEF4",
        ink: {
          DEFAULT: "#1A1F3A",
          muted:   "#404662",
          subtle:  "#6E7491",
          faint:   "#A1A6BE",
        },
        line: {
          DEFAULT: "#E5E7EF",
          hover:   "#D4D4DC",
          strong:  "#D4D4DC",
        },
        primary: {
          DEFAULT: "#5D6BB5",
          hover:   "#4956A0",
          dark:    "#3A4580",
          soft:    "#EEF0FA",
          tint:    "#F6F7FC",
        },
        accent: {
          green:  "#16A34A",
          yellow: "#CA8A04",
          red:    "#DC2626",
        },
      },
      fontFamily: {
        sans:  ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["Inter Tight", "Inter", "sans-serif"],
        mono:  ["JetBrains Mono", "ui-monospace", "SF Mono", "Menlo", "monospace"],
      },
      fontSize: {
        "display-lg": ["4.75rem", { lineHeight: "0.96", letterSpacing: "-0.05em", fontWeight: "600" }],
        display:      ["3.5rem",  { lineHeight: "1.0",  letterSpacing: "-0.045em", fontWeight: "600" }],
        "heading-1":  ["2.75rem", { lineHeight: "1.15", letterSpacing: "-0.03em",  fontWeight: "600" }],
        "heading-2":  ["2rem",    { lineHeight: "1.2",  letterSpacing: "-0.025em", fontWeight: "600" }],
        "heading-3":  ["1.375rem",{ lineHeight: "1.3",  letterSpacing: "-0.02em",  fontWeight: "600" }],
      },
      borderRadius: {
        xs:      "4px",
        sm:      "6px",
        DEFAULT: "8px",
        md:      "10px",
        lg:      "12px",
        xl:      "16px",
        pill:    "9999px",
      },
      boxShadow: {
        sm:         "0 1px 2px rgba(26,31,58,0.05)",
        card:       "0 4px 16px rgba(93,107,181,0.10), 0 1px 2px rgba(26,31,58,0.05)",
        "card-hover":"0 8px 24px rgba(93,107,181,0.15), 0 2px 6px rgba(26,31,58,0.06)",
        lg:         "0 24px 48px -12px rgba(93,107,181,0.20), 0 2px 4px rgba(26,31,58,0.05)",
        float:      "0 24px 60px -10px rgba(93,107,181,0.35), 0 2px 4px rgba(26,31,58,0.05)",
        glow:       "0 0 0 4px rgba(93,107,181,0.12)",
        "glow-ring":"0 0 0 4px rgba(93,107,181,0.14), 0 0 60px -10px rgba(93,107,181,0.4)",
        "btn-primary":"inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 2px rgba(73,86,160,0.25), 0 4px 14px -2px rgba(93,107,181,0.45)",
      },
      animation: {
        "fade-up":      "fadeUp 0.6s ease-out forwards",
        "fade-in":      "fadeIn 0.4s ease-out forwards",
        float:          "kpFloat 4s ease-in-out infinite",
        "float-slow":   "kpFloat 7s ease-in-out infinite",
        marquee:        "kpMarquee 40s linear infinite",
        pulse:          "kpPulse 1.6s ease-in-out infinite",
        aurora:         "kpAurora 14s ease-in-out infinite",
        shimmer:        "kpShimmer 3s linear infinite",
      },
      keyframes: {
        fadeUp:    { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn:    { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        kpFloat:   { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        kpMarquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        kpPulse:   { "0%,100%": { opacity: "1", transform: "scale(1)" }, "50%": { opacity: ".4", transform: "scale(.9)" } },
        kpAurora:  { "0%,100%": { transform: "translate(0,0) scale(1)" }, "50%": { transform: "translate(-3%,2%) scale(1.05)" } },
        kpShimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};

export default config;
