/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {},
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        registerImageLight: "url('/src/assets/registerLight.svg')",
        registerImageDark: "url('/src/assets/registerDark.svg')",
        loginImageLight: "url('/src/assets/loginLight.svg')",
        loginImageDark: "url('/src/assets/loginDark.svg')",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
