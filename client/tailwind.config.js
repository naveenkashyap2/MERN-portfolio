/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B1120', // primary background
          900: '#111827', // secondary background
          850: '#172033', // card
          800: '#1E293B', // elevated card
        },
        brand: {
          DEFAULT: '#3B82F6',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
        },
        cyan: { DEFAULT: '#06B6D4' },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        body: '#F8FAFC',
        muted: '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(0,0,0,0.5)',
        card: '0 16px 40px -20px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(59,130,246,0.4), 0 8px 30px -8px rgba(59,130,246,0.45)',
        cyan: '0 0 0 1px rgba(6,182,212,0.4), 0 8px 30px -8px rgba(6,182,212,0.4)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(1200px 600px at 20% -10%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(6,182,212,0.14), transparent 55%)',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'draw-line': {
          to: { strokeDashoffset: '0' },
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2.6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
