import type { Config } from "tailwindcss";

const config: Config = {
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
          DEFAULT: "#05070d",
          50: "#0a0d16",
          100: "#0d1220",
          200: "#121828",
          300: "#161d31",
          400: "#1c2540",
          500: "#242e52",
        },
        cyber: {
          50: "#e6fbff",
          100: "#b8f1ff",
          200: "#7ee2ff",
          300: "#3ccfff",
          400: "#0fb8f0",
          500: "#009fd6",
          600: "#007fae",
          700: "#005d80",
        },
        signal: {
          50: "#fff8e1",
          100: "#ffecb3",
          200: "#ffdd7a",
          300: "#ffc83d",
          400: "#ffae00",
          500: "#d98c00",
        },
        threat: {
          400: "#ff5277",
          500: "#ff2d5c",
          600: "#d41d46",
        },
        ok: {
          400: "#47f0a7",
          500: "#18d287",
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
        "display-xl": ["clamp(2.5rem, 6vw, 5.25rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2rem, 4.5vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(60, 207, 255, 0.35)",
        "glow-sm": "0 0 24px -6px rgba(60, 207, 255, 0.35)",
        "glow-amber": "0 0 60px -10px rgba(255, 174, 0, 0.35)",
        ring: "inset 0 0 0 1px rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "grid-cyber":
          "linear-gradient(rgba(60,207,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(60,207,255,0.08) 1px, transparent 1px)",
        "gradient-agent":
          "linear-gradient(135deg, #3ccfff 0%, #ffae00 100%)",
        "gradient-cyber":
          "linear-gradient(135deg, #7ee2ff 0%, #3ccfff 50%, #0fb8f0 100%)",
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
