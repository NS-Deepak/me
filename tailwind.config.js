/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"], // Scans your index.html, projects.html, etc.
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#3780f6",
        "background-light": "#f5f7f8",
        "background-dark": "#09090b",
        "zinc-950": "#09090b",
        "zinc-900": "#18181b",
        "zinc-800": "#27272a",
        "zinc-400": "#a1a1aa",
        "zinc-50": "#fafafa",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "mono": ["Space Mono", "monospace"],
        "sans": ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        }
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        blink: 'blink 1s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
