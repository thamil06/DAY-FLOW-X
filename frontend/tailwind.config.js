/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6fa',
          100: '#e9edf5',
          200: '#c8d3e6',
          500: '#4f46e5', // Primary indigo
          600: '#4338ca',
          700: '#3730a3',
          900: '#1e1b4b',
        }
      }
    },
  },
  plugins: [],
}
