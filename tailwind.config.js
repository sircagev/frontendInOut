/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react")

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'mobile': "576px",
      'tablet': "768px",
      'laptop': "992px",
      'desktop': "1200px",
    }
  },
  darkMode: "class",
  plugins: [nextui()],
}

