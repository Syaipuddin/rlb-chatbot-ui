import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'main' : "#F5F5F5",
        'bubble-main' : "#D9D9D9",
        'secondary': "#647FB5",
        'textInputMain': '#F2EEEE',
        'body-secondary':"#F3F3F3"
      }
    },
  },
  plugins: [],
};
export default config;
