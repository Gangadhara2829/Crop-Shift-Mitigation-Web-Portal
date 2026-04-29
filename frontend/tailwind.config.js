/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f2f8f5',
          100: '#e1efe6',
          200: '#c3e0cf',
          300: '#97cbb1',
          400: '#64af8b',
          500: '#40926c',
          600: '#2f7455',
          700: '#265d45',
          800: '#214b38',
          900: '#1c3e2f',
          950: '#0e2319',
        },
        gold: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        }
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
}
