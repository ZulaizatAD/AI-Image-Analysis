/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        aliceblue: {
          DEFAULT: '#F0F8FF',
          50: '#FAFCFF',
          100: '#F0F8FF',
          200: '#E6F3FF',
          300: '#DBEEFF',
          400: '#D1E9FF',
          500: '#C6E4FF',
          600: '#9BCFFF',
          700: '#70BAFF',
          800: '#45A5FF',
          900: '#1A90FF',
        },
        cadetblue: {
          DEFAULT: '#5F9EA0',
          50: '#F0F7F7',
          100: '#E1EFEF',
          200: '#C3DFDF',
          300: '#A5CFCF',
          400: '#87BFBF',
          500: '#5F9EA0',
          600: '#4C7E80',
          700: '#395F60',
          800: '#263F40',
          900: '#132020',
        },
        primary: {
          50: '#F0F7F7',
          500: '#5F9EA0',
          600: '#4C7E80',
          700: '#395F60',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(95, 158, 160, 0.07), 0 10px 20px -2px rgba(95, 158, 160, 0.04)',
        'glow': '0 0 20px rgba(95, 158, 160, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}