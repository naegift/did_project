/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {},
        screens: {
            mobile: { min: "320px", max: "767px" },
            tablet: { min: "768px", max: "1439px" },
            note: { max: "1440px" },
        },
    },
    plugins: [],
};
