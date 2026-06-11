import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1200px",
      xl: "1440px",
    },
    /* Horizontal padding is set in `globals.css` (`.container`) with safe-area insets. */
    container: {
      center: true,
      padding: "0",
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a1628",
          50: "#0f1d33",
          100: "#13243d",
          200: "#182b47",
          300: "#1d3252",
          400: "#243d63",
          500: "#2d4a78",
        },
        ocean: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        sea: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        azure: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        signal: {
          50: "#fef3c7",
          100: "#fde68a",
          200: "#fcd34d",
          300: "#fbbf24",
          400: "#f59e0b",
          500: "#d97706",
        },
        threat: {
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
        },
        ok: {
          400: "#4ade80",
          500: "#22c55e",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        /* Long prose: same IBM Plex stack for consistency (was separate serif variable) */
        serif: ["var(--font-sans)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        /* Nav, forms, filters — same as sans but explicit in markup */
        ui: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        /** vw-based display; min keeps sub-375 devices readable without forcing overflow */
        "display-xl": [
          "clamp(2rem, 5vw + 1rem, 5.25rem)",
          { lineHeight: "1.05", letterSpacing: "-0.03em" },
        ],
        "display-lg": ["clamp(2rem, 4.5vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(14, 165, 233, 0.4)",
        "glow-sm": "0 0 24px -6px rgba(14, 165, 233, 0.4)",
        "glow-sea": "0 0 60px -10px rgba(34, 211, 238, 0.4)",
        ring: "inset 0 0 0 1px rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "grid-ocean":
          "linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px)",
        "gradient-agent":
          "linear-gradient(135deg, #38bdf8 0%, #22d3ee 100%)",
        "gradient-ocean":
          "linear-gradient(135deg, #7dd3fc 0%, #38bdf8 50%, #0ea5e9 100%)",
        "gradient-sea":
          "linear-gradient(135deg, #67e8f9 0%, #22d3ee 50%, #06b6d4 100%)",
      },
      keyframes: {
        "ping-large": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "75%, 100%": { transform: "scale(3)", opacity: "0" },
        },
        "move-left": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "move-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
        "cursor-blink": {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "ping-large": "ping-large 1.4s ease-in-out infinite",
        "move-left": "move-left 40s linear infinite",
        "move-right": "move-right 40s linear infinite",
        "scan-line": "scan-line 6s linear infinite",
        "pulse-soft": "pulse-soft 2.6s ease-in-out infinite",
        "cursor-blink": "cursor-blink 1s step-end infinite",
        "float-y": "float-y 4s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
