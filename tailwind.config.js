/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#e0f2fe", // Bardzo jasny niebieski
        secondary: {
          DEFAULT: "#81d4fa", // Sky-blue
          100: "#b3e5fc", // Jasny sky-blue
          200: "#4fc3f7", // Nieco ciemniejszy sky-blue
        },
        black: {
          DEFAULT: "#000",
          100: "#fff5ee", // Bardzo jasny sand
          200: "#f5deb3", // Ciemniejszy sand
        },
        gray: {
          100: "#E9ECEF", // Bardzo jasny szary
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
