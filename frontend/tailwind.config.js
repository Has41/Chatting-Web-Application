/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "dusty-grass": "linear-gradient(15deg, #D4FC79 0%, #96E6A1 100%)",
        "button-color": "linear-gradient(1deg, #D4FC79 0%, #96E6A1 100%)",
      },
      backgroundColor: {
        "custom-green": "#96E6A1",
      },
      textColor: {
        "custom-text": "#96E6A1",
      },
      borderColor: {
        "custom-border": "#96E6A1",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        mont: ["Montserrat", "sans-serif"],
      },
      screens: {
        sm: { min: "560px", max: "640px" },
      },
      keyframes: {
        "ping-slow": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "0.5",
          },
          "50%": {
            transform: "scale(1.5)",
            opacity: "0",
          },
        },
      },
      animation: {
        "ping-slow": "ping-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
