/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
        },
        secondary: {
          500: '#f59e0b',
          600: '#d97706',
        },
        surface: '#ffffff',
        background: '#f8faf9',
        muted: '#64748b',
        border: '#e2e8f0',
        charcoal: '#1e293b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0,0,0,0.05)',
        'card': '0 4px 24px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
