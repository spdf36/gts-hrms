/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gts: {
          primary: '#0B2545',    // Deep Enterprise Navy
          secondary: '#13315C',  // Slightly lighter Navy
          accent: '#134074',     // Bright Blue for buttons
          surface: '#EEF4ED',    // Very light grey/green tint for backgrounds
          text: '#000000',       // Main text
          muted: '#8DA9C4',      // Secondary text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}