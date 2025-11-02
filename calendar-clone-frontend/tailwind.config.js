/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        googlegray: '#f1f3f4',
        googleblue: '#1a73e8',
      },
    },
  },
  plugins: [],
};
