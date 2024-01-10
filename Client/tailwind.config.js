/** @type {import('tailwindcss').Config} */

const path = require("path");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
   
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
