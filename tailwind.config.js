/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0b0a",
        "bg-glow": "#1a1712",
        yellow: {
          DEFAULT: "#f5c518",
          dark: "#c9a100",
        },
        cream: "#f5f1e8",
      },
      fontFamily: {
        display: ["Anton", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};