/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#b13dff',
          50: '#fbf5ff',
          100: '#f5e7ff',
          200: '#edd3ff',
          300: '#dfb0ff',
          400: '#cb7eff',
          500: '#b13dff',
          600: '#a42af3',
          700: '#8f1ad6',
          800: '#791aaf',
          900: '#63178c',
          950: '#450269',
        },
        secondary: {
          DEFAULT: '#f97607',
          50: '#fff8eb',
          100: '#ffeac6',
          200: '#ffd388',
          300: '#ffb13d',
          400: '#ff9c20',
          500: '#f97607',
          600: '#dd5202',
          700: '#b73506',
          800: '#94280c',
          900: '#7a230d',
          950: '#460f02',
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'shimmer': 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
      },
    },
  },
  plugins: [],
};
