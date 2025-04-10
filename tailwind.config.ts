import type { Config } from "tailwindcss";
import { themeValues } from "./src/constants/styles/theme";

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
        primary: themeValues.colors.primary,
        secondary: themeValues.colors.secondary,
        'primary-light': themeValues.colors.gray[600],
        'primary-dark': themeValues.colors.gray[800],
        ...themeValues.colors.gray,
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
  darkMode: 'class',
} satisfies Config;

// import type { Config } from "tailwindcss";

// export default {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//       },
//     },
//   },
//   plugins: [],
// } satisfies Config;
