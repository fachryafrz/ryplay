/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      aspectRatio: {
        poster: "3/4",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
      },
      gridTemplateColumns: {
        24: "repeat(24, minmax(0, 1fr))",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#98ee2f",
          "primary-content": "#081401",
          secondary: "#212225",
          "secondary-content": "#cdcecf",
          accent: "#00ffff",
          "accent-content": "#001616",
          neutral: "#101114",
          "neutral-content": "#c9c9ca",
          "base-100": "#0b0c0d",
          "base-200": "#08090a",
          "base-300": "#060607",
          "base-content": "#c7c7c8",
          info: "#0000ff",
          "info-content": "#c6dbff",
          success: "#16a34a",
          "success-content": "#000a02",
          warning: "#facc15",
          "warning-content": "#150f00",
          error: "#ff0000",
          "error-content": "#160000",
        },
      },
    ],
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
    }),
  ],
};
