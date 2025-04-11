module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Tailwind will scan these files for classes
    './public/index.html', // Include your public folder or any other location where HTML is used
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}