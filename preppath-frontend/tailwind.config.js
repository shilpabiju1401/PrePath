/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        aptitude: {
          light: '#dbeafe',
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
        },
        reasoning: {
          light: '#ede9fe',
          DEFAULT: '#8b5cf6',
          dark: '#6d28d9',
        },
        verbal: {
          light: '#d1fae5',
          DEFAULT: '#10b981',
          dark: '#047857',
        },
        coding: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow-brand': '0 0 20px rgba(99, 102, 241, 0.35)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.35)',
      }
    },
  },
  plugins: [],
}
