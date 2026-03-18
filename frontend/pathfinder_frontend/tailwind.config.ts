import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pf-purple-500': '#7C3AED',
        'pf-purple-50': '#F5F3FF',
        'pf-glass': '#F8F5FF',
        'pf-border': '#DDD6FE',
        'pf-purple-900': '#1E0B40',
        'pf-purple-800': '#2D1260',
        'pf-purple-600': '#5B21B6',
        'pf-success': '#059669',
      },
      fontFamily: {
        sora: ["var(--font-sora)"],
        "dm-sans": ["var(--font-dm-sans)"],
        jetbrains: ["var(--font-jetbrains)"]
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FDFDFF",
            foreground: "#11181C",
            content1: "#FFFFFF",
            content2: "#F8FAFC",
            content3: "#F1F5F9",
            content4: "#E2E8F0",
            divider: "rgba(0, 0, 0, 0.05)",
          }
        },
        dark: {
          colors: {
            background: "#0f172a", // slate-900
            foreground: "#f8fafc", // slate-50
            content1: "#1e293b", // slate-800
            content2: "#334155", // slate-700
            content3: "#475569", // slate-600
            content4: "#64748b", // slate-500
            divider: "rgba(255, 255, 255, 0.1)",
          }
        }
      }
    }),
  ],
};

export default config;
