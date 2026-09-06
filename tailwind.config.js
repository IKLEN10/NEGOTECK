/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Fondo y texto base de la aplicación
        papel: {
          DEFAULT: '#FFFFFF',
          suave: '#F7F9FC',
          tenue: '#E9EEF6',
        },
        tinta: {
          DEFAULT: '#0F172A',
        },
        // Identidad de marca: azul rey (color principal)
        azulRey: {
          50: '#EEF3FD',
          100: '#DCE6FB',
          300: '#8FADEF',
          500: '#2453D6',
          600: '#1D3FB0',
          700: '#182F7D',
          800: '#132359',
          900: '#0D1A40',
        },
        // Identidad de marca: naranja (acentos y estados)
        naranja: {
          50: '#FFF3E8',
          100: '#FFE2C7',
          300: '#FFB067',
          500: '#F2780C',
          600: '#D9640A',
          700: '#A34C08',
          800: '#7A3906',
        },
        // Identidad de marca: verde (acentos y estados)
        verde: {
          50: '#EAFBF1',
          100: '#CFF5E0',
          300: '#7EDCAA',
          500: '#1FB865',
          600: '#189653',
          700: '#137641',
        },
      },
      fontFamily: {
        // Toda la aplicación usa exclusivamente Poppins
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Poppins"', 'sans-serif'],
        mono: ['"Poppins"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px -12px rgba(15, 23, 42, 0.18)',
        card: '0 1px 1px rgba(15, 23, 42, 0.05), 0 12px 32px -16px rgba(15, 23, 42, 0.25)',
      },
      borderRadius: {
        card: '10px',
      },
      maxWidth: {
        content: '1240px',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        toastIn: {
          '0%': { opacity: 0, transform: 'translateY(-8px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        toastIn: 'toastIn 0.25s ease-out both',
        shimmer: 'shimmer 1.6s infinite linear',
      },
    },
  },
  plugins: [],
}
