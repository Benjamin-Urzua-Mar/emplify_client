import { nextui } from "@nextui-org/react"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
   
    extend: {
      colors: {
        "Primary": "#890bff",
        "PrimaryTransparent": "rgba(127, 17, 224, 0.2)",
        "PrimarySemiTransparent": "rgba(127, 17, 224, 0.5)",
        "Secondary": "#7715d3",
        "Common": "#777777",
        "SecondCommon": "#444444",
        "Transparent": "rgba(255, 255, 255, 0.6)"
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}

