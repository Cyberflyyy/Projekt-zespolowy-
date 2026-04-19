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
        // Airtable-inspired design tokens
        canvas: "#ffffff",
        surface: "#F8F9FA",
        sunken: "#F0F1F3",
        ink: {
          DEFAULT: "#1C1C1C",
          muted: "#6B7280",
          subtle: "#9CA3AF",
          faint: "#D1D5DB",
        },
        line: {
          DEFAULT: "#E5E7EB",
          hover: "#D1D5DB",
          strong: "#9CA3AF",
        },
        primary: {
          DEFAULT: "#2D7FF9",
          hover: "#1A6FE8",
          dark: "#0E5CC9",
          soft: "#EBF3FF",
        },
        accent: {
          blue: "#2D7FF9",
          "blue-soft": "#EBF3FF",
          green: "#20C933",
          "green-soft": "#E3FCEC",
          red: "#F82B60",
          "red-soft": "#FFEBF1",
          yellow: "#FCAB40",
          "yellow-soft": "#FFF5E0",
          purple: "#8B46FF",
          "purple-soft": "#F0E8FF",
          teal: "#06A77D",
          "teal-soft": "#E0F8F2",
          orange: "#FF6F2C",
          "orange-soft": "#FFF0E8",
          pink: "#FF08C2",
          "pink-soft": "#FFE8FA",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Helvetica Neue",
          "sans-serif",
        ],
        serif: [
          "Lyon",
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
      },
      fontSize: {
        "display-lg": ["4rem", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "800" }],
        display: ["2.75rem", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" }],
        "heading-1": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-2": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-3": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
        pop: "0 16px 48px rgba(0,0,0,0.14)",
        inset: "inset 0 0 0 1.5px #E5E7EB",
        glow: "0 0 0 3px rgba(45,127,249,0.25)",
        "glow-lg": "0 0 30px rgba(45,127,249,0.18)",
        float: "0 24px 60px rgba(0,0,0,0.14), 0 6px 20px rgba(0,0,0,0.08)",
      },
      maxWidth: {
        content: "1200px",
        prose: "680px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        float: "float 4s ease-in-out infinite",
        "float-slow": "float 7s ease-in-out infinite",
        "spin-slow": "spin 14s linear infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "bounce-subtle": "bounceSubtle 2.5s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(0.5deg)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(45,127,249,0)" },
          "50%": { boxShadow: "0 0 40px 12px rgba(45,127,249,0.12)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
