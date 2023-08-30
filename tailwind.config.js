/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        cover: "3 / 4",
      },
      screens: {
        xs: "375px",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
      colors: {
        primary: {
          bg: "#15181D",
          secondary: "#1E2127",
          yellow: "#FEDE24",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
    }),
  ],
};
