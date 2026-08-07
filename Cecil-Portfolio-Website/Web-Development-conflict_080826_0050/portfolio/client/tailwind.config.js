/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#111827',
        accent: '#00E5FF',
        success: '#22C55E',
        muted: '#9CA3AF',
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'sans-serif'],
        body: ['Sora', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 45px -12px rgba(0, 229, 255, 0.35)',
        'glow-sm': '0 0 25px -8px rgba(0, 229, 255, 0.45)',
      },
      animation: {
        marquee: 'marquee 42s linear infinite',
        float: 'float 7s ease-in-out infinite',
        scan: 'scan 4s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          to: { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        scan: {
          '0%, 100%': { top: '4%', opacity: '0' },
          '10%, 90%': { opacity: '1' },
          '50%': { top: '94%' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(0,229,255,0.5)' },
          '50%': { opacity: '0.6', boxShadow: '0 0 0 6px rgba(0,229,255,0)' },
        },
      },
    },
  },
  plugins: [],
};
