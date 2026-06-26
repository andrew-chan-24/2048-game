// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",                    // ✅ Must include this
    "./src/**/*.{js,ts,jsx,tsx}",      // ✅ Scans all component files
  ],
  theme: {
    extend: {
      fontFamily: {
        game: ['"Clear Sans"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
        colors: {
          board:       '#bbada0',
          cell:        '#cdc1b4',
          'tile-2':    '#eee4da',
          'tile-4':    '#ede0c8',
          'tile-8':    '#f2b179',
          'tile-16':   '#f59563',
          'tile-32':   '#f67c5f',
          'tile-64':   '#f65e3b',
          'tile-128':  '#edcf72',
          'tile-256':  '#edcc61',
          'tile-512':  '#edc850',
          'tile-1024': '#edc53f',
          'tile-2048': '#edc22e',
          'tile-high': '#3c3a32',
        },
    },
  },
  plugins: [],
}