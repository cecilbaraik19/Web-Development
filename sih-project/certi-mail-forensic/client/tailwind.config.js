/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'matrix-bg': '#000000',
        'matrix-panel': '#020c02',
        'matrix-green': '#00ff41',
        'matrix-green-dim': '#00b32d',
        'matrix-border': '#0d3d0d',
        'matrix-danger': '#ff2b4d',
        'matrix-warning': '#ffb800',
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        display: ['"VT323"', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 8px rgba(0, 255, 65, 0.5), 0 0 2px rgba(0, 255, 65, 0.8)',
        'glow-red': '0 0 8px rgba(255, 43, 77, 0.5), 0 0 2px rgba(255, 43, 77, 0.8)',
        'glow-amber': '0 0 8px rgba(255, 184, 0, 0.5), 0 0 2px rgba(255, 184, 0, 0.8)',
      },
      animation: {
        flicker: 'flicker 4s infinite',
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.92' },
        },
      },
    },
  },
  plugins: [],
}