import { nextui } from "@nextui-org/react"

/*
 * Design tokens de Emplify.
 * Documentación completa en docs/GUIA_DE_ESTILOS.md
 */
const brand = {
  50: "#f6efff",
  100: "#ecdcff",
  200: "#d9b9ff",
  300: "#c08aff",
  400: "#a54dff",
  500: "#890bff", // Color principal de marca
  600: "#7715d3", // Hover / estados activos / barra superior
  700: "#6210ad",
  800: "#4d0d87",
  900: "#380a62",
  DEFAULT: "#890bff",
  foreground: "#ffffff",
}

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
        brand,
        ink: {
          DEFAULT: "#1f1f24", // Títulos
          body: "#444444",    // Texto de párrafo
          muted: "#777777",   // Texto secundario / ayudas
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f7f7f9",   // Fondo de páginas internas
        },
      },
      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Poppins", "Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem", // Ancho máximo del contenido (1152px)
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 16, 20, 0.04), 0 4px 16px rgba(16, 16, 20, 0.06)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: brand,
            secondary: brand,
            focus: brand[500],
          },
        },
      },
    }),
  ],
}
