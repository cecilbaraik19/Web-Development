/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'glow-cyan': '0 0 12px rgba(34, 211, 238, 0.35), 0 0 2px rgba(34, 211, 238, 0.6)',
        'glow-emerald': '0 0 12px rgba(52, 211, 153, 0.35), 0 0 2px rgba(52, 211, 153, 0.6)',
        'glow-red': '0 0 14px rgba(248, 113, 113, 0.45), 0 0 2px rgba(248, 113, 113, 0.7)',
        'glow-amber': '0 0 14px rgba(251, 191, 36, 0.45), 0 0 2px rgba(251, 191, 36, 0.7)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'blink': 'blink 1.1s steps(1) infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        blink: {
          '0%, 49%': { opacity: 1 },
          '50%, 100%': { opacity: 0 },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}