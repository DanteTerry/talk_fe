/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        newLogo: "#0CC0DF",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        registerImageLight: "url('/src/assets/registerLight.svg')",
        registerImageDark: "url('/src/assets/registerDark.svg')",
        loginImageLight: "url('/src/assets/loginLight.svg')",
        loginImageDark: "url('/src/assets/loginDark.svg')",
        chatBackgroundLight:
          "url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)",
        chatBackgroundDark: "url('/src/assets/darkChatBg.png')",
      },
    },
    keyframes: {
      rotate180: {
        "0%": { transform: "rotate(0deg)" },
        "50%": { transform: "rotate(180deg)", color: "#22c55e" },
        "100%": { transform: "rotate(180deg)" },
      },
      reverse180: {
        "0%": { transform: "rotate(180deg)", color: "#22c55e" },
        "50%": { transform: "rotate(180deg)", color: "#22c55e" },
        "100%": { transform: "rotate(0deg)" },
      },
    },
    animation: {
      rotate180: "rotate180 .5s ease-in-out ",
      reverse180: "reverse180 .5s ease-in-out forward",
    },
  },
  plugins: [require("tailwind-scrollbar")],
  darkMode: "class",
};
