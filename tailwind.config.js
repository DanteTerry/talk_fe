/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        whatsappGreen: "#25D366",
        whatsappLightGreen: "#DCF8C6",
        whatsappDarkGreen: "#075E54",
        whatsappBlue: "#34B7F1",
        whatsappLightBlue: "#ECE5DD",
        whatsappDarkBlue: "#128C7E",
        whatsappGray: "#BDC3C7",
        whatsappLightGray: "#F5F5F5",
        whatsappDarkGray: "#4A4A4A",
      },
    },
  },
  plugins: [],
};
