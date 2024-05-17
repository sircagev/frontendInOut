/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react")
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
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
})

