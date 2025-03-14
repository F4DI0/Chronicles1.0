/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/forms/**/*.{js,jsx}"  
  ],
  theme: {
    extend: {
        colors: {
          warmBeige: "#F5E1C8", // ✅ Background for light mode
          warmBrown: "#8B5E3B", // ✅ Headers and buttons in light mode
          warmText: "#3E2C2A", // ✅ Text for light mode
        },
    },
  },
  plugins: [],
}