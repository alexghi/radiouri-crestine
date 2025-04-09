/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      colors: {
        spotify: {
          base: '#121212',
          highlight: '#1DB954',
          card: '#181818',
          hover: '#282828',
        },
      },
    },
  },
  plugins: [],
};