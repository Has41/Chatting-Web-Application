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
        "custom-green": "#96E6A1"
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
        }
      },
      animation: {
        "ping-slow": "ping-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      borderRadius: {
        sent: "18px 18px 0 18px",
        recieved: "18px 18px 18px 0"
      }
    }
  },
  plugins: []
}
