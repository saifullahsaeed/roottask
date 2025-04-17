import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "3xs": ["0.5rem", { lineHeight: "0.625rem" }],
        "card-title": ["0.575rem", { lineHeight: "0.625rem" }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        hover: "hsl(var(--hover))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        priority: {
          low: {
            DEFAULT: "hsl(215, 20%, 65%)",
            light: "hsl(215, 20%, 95%)",
            dark: "hsl(215, 20%, 25%)",
          },
          medium: {
            DEFAULT: "hsl(45, 93%, 47%)",
            light: "hsl(45, 93%, 95%)",
            dark: "hsl(45, 93%, 25%)",
          },
          high: {
            DEFAULT: "hsl(0, 84%, 60%)",
            light: "hsl(0, 84%, 95%)",
            dark: "hsl(0, 84%, 25%)",
          },
          critical: {
            DEFAULT: "hsl(0, 72%, 51%)",
            light: "hsl(0, 72%, 95%)",
            dark: "hsl(0, 72%, 25%)",
          },
          blocker: {
            DEFAULT: "hsl(271, 91%, 65%)",
            light: "hsl(271, 91%, 95%)",
            dark: "hsl(271, 91%, 25%)",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
