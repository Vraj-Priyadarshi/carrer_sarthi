/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      animation: {
        'gradient-shift': 'gradient-shift 20s ease-in-out infinite',
        'gradient-shift-secondary': 'gradient-shift-secondary 25s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.08' },
          '33%': { transform: 'translate(10%, -5%) scale(1.1)', opacity: '0.12' },
          '66%': { transform: 'translate(-5%, 10%) scale(0.95)', opacity: '0.10' },
          '100%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.08' },
        },
        'gradient-shift-secondary': {
          '0%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.06' },
          '33%': { transform: 'translate(-8%, 8%) scale(1.05)', opacity: '0.08' },
          '66%': { transform: 'translate(12%, -6%) scale(0.9)', opacity: '0.10' },
          '100%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.06' },
        },
      },
    },
  },
  plugins: [],
}
