import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)", surface: "var(--surface)", muted: "var(--muted)", line: "var(--line)",
        ink: "var(--ink)", sub: "var(--sub)", brand: "var(--brand)", band: "var(--band)",
      },
      fontFamily: { display: ["var(--font-display)", "system-ui", "sans-serif"], sans: ["var(--font-body)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
