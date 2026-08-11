/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {

      /* ===========================
         COLORS
      =========================== */

      colors: {

        primary: "#C98FA8",
        "primary-dark": "#B27793",
        "primary-light": "#EBCFDB",

        blush: "#F8DCE6",
        pastel: "#FFF7FA",
        rose: "#D9A7BC",

        ivory: "#FFFDFC",
        surface: "#FFFFFF",
        "surface-alt": "#FFF8FB",

        border: "#F0DDE5",

        heading: "#33282D",
        body: "#6F6469",
        muted: "#A89BA1",

      },

      /* ===========================
         FONTS
      =========================== */

      fontFamily: {

        heading: ["Playfair Display", "serif"],

        body: ["Inter", "sans-serif"],

      },

      /* ===========================
         BOX SHADOWS
      =========================== */

      boxShadow: {

        xs: "0 6px 18px rgba(201,143,168,.05)",

        soft: "0 12px 28px rgba(201,143,168,.08)",

        premium: "0 22px 55px rgba(201,143,168,.12)",

        luxury: "0 40px 90px rgba(201,143,168,.16)",

        glow: "0 0 40px rgba(217,167,188,.25)",

      },

      /* ===========================
         BORDER RADIUS
      =========================== */

      borderRadius: {

        premium: "22px",

        luxury: "30px",

        xl2: "36px",

      },

      /* ===========================
         BACKGROUND
      =========================== */

      backgroundImage: {

        "hero-gradient":
          "linear-gradient(180deg,#FFFDFC,#FFF6F9)",

        "primary-gradient":
          "linear-gradient(135deg,#D8A6BB,#C889A5)",

        "card-gradient":
          "linear-gradient(180deg,#FFFFFF,#FFF8FB)",

        "footer-gradient":
          "linear-gradient(180deg,#3A3034,#2A2326)",

      },

      /* ===========================
         KEYFRAMES
      =========================== */

      keyframes: {

        float: {

          "0%,100%": {

            transform: "translateY(0)",

          },

          "50%": {

            transform: "translateY(-12px)",

          },

        },

        fadeUp: {

          "0%": {

            opacity: "0",

            transform: "translateY(40px)",

          },

          "100%": {

            opacity: "1",

            transform: "translateY(0)",

          },

        },

        shine: {

          "0%": {

            left: "-120%",

          },

          "100%": {

            left: "140%",

          },

        },

        pulseSoft: {

          "0%,100%": {

            opacity: ".5",

            transform: "scale(1)",

          },

          "50%": {

            opacity: "1",

            transform: "scale(1.05)",

          },

        },

      },

      /* ===========================
         ANIMATIONS
      =========================== */

      animation: {

        float: "float 6s ease-in-out infinite",

        fadeUp: "fadeUp .8s ease forwards",

        shine: "shine 1.2s ease",

        pulseSoft: "pulseSoft 4s ease infinite",

      },

      /* ===========================
         BLUR
      =========================== */

      backdropBlur: {

        luxury: "22px",

      },

      /* ===========================
         TRANSITION
      =========================== */

      transitionTimingFunction: {

        luxury: "cubic-bezier(.4,0,.2,1)",

      },

      transitionDuration: {

        350: "350ms",

        450: "450ms",

      },

      /* ===========================
         SPACING
      =========================== */

      spacing: {

        18: "4.5rem",

        22: "5.5rem",

        26: "6.5rem",

      },

      /* ===========================
         MAX WIDTH
      =========================== */

      maxWidth: {

        content: "1440px",

      },

    },
  },

  plugins: [],
};