/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        themeBase: '#3B3B3B',
        themeAccent: '#EDEDED',
        themeGlow: '#FFFFFF'
      },
      boxShadow: {
        'glow': '0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
