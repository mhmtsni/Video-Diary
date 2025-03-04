/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}', // Includes app directory
    './src/**/*.{js,jsx,ts,tsx}', // Includes src directory
    './components/**/*.{js,jsx,ts,tsx}', // Includes components directory
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
}
