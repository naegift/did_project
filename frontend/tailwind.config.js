/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    screens: {
      mobileTab: { min: "360px", max: "1280x" },
      desktop: { max: "1920px" },
    },
  },
  plugins: [],
};
