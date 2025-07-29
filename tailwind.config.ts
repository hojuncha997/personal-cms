import type { Config } from "tailwindcss";
import { themeColors } from "./src/constants/styles/theme";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: themeColors.primary,
        secondary: themeColors.secondary,
        'primary-light': themeColors.gray[600],
        'primary-dark': themeColors.gray[800],
        ...themeColors.gray,
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
  darkMode: 'class',
} satisfies Config;