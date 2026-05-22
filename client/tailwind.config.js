/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        gold: '#D4AF37',
        'dark-gold': '#B89778',
        dark: '#0A0A0A',
        cream: '#FAF9F6',
      }
    },
  },
  plugins: [],
}