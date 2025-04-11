/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src//*.{js,jsx}'],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f0f4ff',
            100: '#dbe4ff',
            200: '#bac8ff',
            300: '#91a7ff',
            400: '#748ffc',
            500: '#4c6ef5',
            600: '#3b5bdb',
            700: '#364fc7',
            800: '#2f44ad',
            900: '#283a8f',
            950: '#1e2f78',
          }
        }
      },
    },
    plugins: [],
  };