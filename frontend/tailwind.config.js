/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        shoppoo: '#FF8C42',  // main orange
        shoppoo1: '#FF5733',   // deeper orange
        shoppoo2: '#FFB38A',  // lighter orange
        shoppoo3: '#FFF3ED',   // very light orange/peach
        shoppoo4: '#333333'    // dark gray for text
      }
    },
  },
  plugins: [],
};
