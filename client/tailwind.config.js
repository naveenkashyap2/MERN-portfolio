/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0B1120',
          secondary: '#111827',
          card: '#172033',
          elevated: '#1E293B',
        },
        ink: {
          DEFAULT: '#F8FAFC',
          mute: '#94A3B8',
        },
        accent: {
          DEFAULT: '#3B82F6',
          cyan: '#06B6D4',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        card: '0 10px 40px rgba(0,0,0,0.28)',
        glow: '0 0 0 1px rgba(59,130,246,0.35), 0 8px 30px rgba(59,130,246,0.15)',
      },
    },
  },
  plugins: [],
};
