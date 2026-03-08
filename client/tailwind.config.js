/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "dusty-grass": "linear-gradient(15deg, #D4FC79 0%, #96E6A1 100%)",
        "button-color": "linear-gradient(1deg, #D4FC79 0%, #96E6A1 100%)"
      },
      backgroundColor: {
        "custom-green": "#96E6A1",
        "custom-white": "#FAF9F6"
      },
      textColor: {
        "custom-text": "#96E6A1"
      },
      borderColor: {
        "custom-border": "#96E6A1"
      },
      boxShadow: {
        right: "10px 0 15px -3px rgba(0, 0, 0, 0.3)"
      },
      accentColor: {
        "custom-text": "#96E6A1"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        mont: ["Montserrat", "sans-serif"]
      },
      keyframes: {
        "ping-slow": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "0.5"
          },
          "50%": {
            transform: "scale(1.5)",
            opacity: "0"
          }
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 }
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 }
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" }
        }
      },
      animation: {
        "ping-slow": "ping-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        slideInRight: "slideInRight 0.5s ease-in-out forwards",
        slideInLeft: "slideInLeft 0.5s ease-in-out backwards",
        fadeIn: "fadeIn 0.3s ease-in-out"
      },
      borderRadius: {
        sent: "18px 18px 0 18px",
        recieved: "18px 18px 18px 0"
      }
    }
  },
  plugins: []
}
