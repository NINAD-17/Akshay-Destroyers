/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50', // Green color for food/nature theme
        secondary: '#FF8C00', // Orange for food-related accent
        accent: '#1976D2', // Blue for UI accents
      },
    },
  },
  plugins: [],
}

