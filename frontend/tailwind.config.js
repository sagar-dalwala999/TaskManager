/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Use these if you want fallback custom colors in addition to DaisyUI
        "select-bg-light": "#ffffff", // Light theme dropdown background
        "select-bg-dark": "#2d3748", // Dark theme dropdown background
        "select-border-light": "#d1d5db", // Light theme border
        "select-border-dark": "#4a5568", // Dark theme border
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"], // List your themes here
  },
};
