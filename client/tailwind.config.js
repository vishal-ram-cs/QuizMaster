/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#7c3aed' }, // purple-600
        secondary: { DEFAULT: '#ec4899' } // pink-500
      }
    }
  },
  plugins: []
};