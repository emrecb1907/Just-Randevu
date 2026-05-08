import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: {
          DEFAULT: "#008B47",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F8CD24",
          foreground: "#171717",
        },
        danger: "#D92D20",
        success: "#008B47",
        warning: "#F8CD24",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(15, 23, 42, 0.10)",
        panel: "0 1px 2px rgba(15, 23, 42, 0.06), 0 18px 55px rgba(15, 23, 42, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-helvena)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-helvena)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
