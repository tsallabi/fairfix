import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FBF7EE",
          2: "#F3ECD9",
          3: "#EAE2CB",
        },
        ink: {
          DEFAULT: "#0B1F33",
          2: "#34455A",
          3: "#7A879A",
        },
        line: "#E3DAC3",
        brand: {
          1: "#0B7F58",
          2: "#10B981",
          3: "#34D399",
        },
        navy: {
          1: "#0B1F33",
          2: "#14314D",
          3: "#1F4667",
        },
        coral: "#F26D5B",
        amber: "#E6A429",
      },
      fontFamily: {
        serif: [
          '"Iowan Old Style"',
          '"Palatino Linotype"',
          "Palatino",
          "Georgia",
          '"Times New Roman"',
          "serif",
        ],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          '"Inter"',
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          '"SF Mono"',
          '"JetBrains Mono"',
          "Menlo",
          '"Cascadia Code"',
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        "brand-glow": "0 8px 24px -8px rgba(16, 185, 129, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
