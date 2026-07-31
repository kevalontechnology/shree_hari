/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Tells Tailwind to scan all your React files for classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}