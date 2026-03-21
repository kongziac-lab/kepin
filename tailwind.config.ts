import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink:     "#0c0a0a",
        surface: "#17181c",
        panel:   "#1f2127",
        line:    "#2d3139",
        accent: {
          DEFAULT: "#cf2e2e",
          soft:    "#f97360",
          gold:    "#f4b942",
          mint:    "#4ec9a8"
        },
        cr: {
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C"
        },
        gold: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706"
        }
      },
      fontFamily: {
        sans: ["Pretendard", "SUIT", "Apple SD Gothic Neo", "Noto Sans KR", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow:     "0 20px 50px rgba(207, 46, 46, 0.22)",
        "glow-sm":"0 8px 24px rgba(185, 28, 28, 0.35)"
      },
      backgroundImage: {
        mesh: "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(185,28,28,0.2), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(245,158,11,0.07), transparent 50%), linear-gradient(180deg, #0c0a0a 0%, #0f0c0c 100%)"
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem"
      }
    }
  },
  plugins: []
};

export default config;
