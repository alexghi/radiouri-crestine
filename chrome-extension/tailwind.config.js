/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/popup.html",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-base': '#121212',
        'spotify-hover': '#1a1a1a',
        'spotify-text': '#ffffff',
        'spotify-text-muted': '#b3b3b3',
      }
    },
  },
  plugins: [],
}
