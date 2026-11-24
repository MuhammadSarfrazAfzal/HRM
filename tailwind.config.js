/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        // Restrained indigo-blue primary accent used for actions, focus and selection.
        brand: {
          50: "#eef4ff",
          100: "#dae6ff",
          200: "#bdd3ff",
          300: "#90b6fe",
          400: "#5d8efb",
          500: "#3a68f6",
          600: "#2449eb",
          700: "#1c37d8",
          800: "#1d2faf",
          900: "#1e2e8a",
          950: "#171e54",
        },
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(15 23 42 / 0.04)",
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.03)",
        "card-hover": "0 4px 12px -2px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.04)",
        overlay: "0 24px 48px -12px rgb(15 23 42 / 0.25)",
      },
      keyframes: {
        // Opacity only, and filled "backwards": a lingering transform/opacity animation would
        // keep a stacking context on the page and trap its fixed modals under the header.
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out backwards",
        "slide-in-right": "slide-in-right 220ms cubic-bezier(0.32, 0.72, 0, 1) backwards",
        "slide-in-left": "slide-in-left 220ms cubic-bezier(0.32, 0.72, 0, 1) both",
      },
    },
  },
  plugins: [],
};
