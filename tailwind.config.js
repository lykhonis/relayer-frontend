const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@apideck/components/**/*.js'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'basier-circle': ['Basier Circle', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        ...colors,
        gray: colors.slate,
        background: '#130E2E',
        primary: {
          50: '#fdf2f8',
          100: '#fde6f3',
          200: '#fdcde8',
          300: '#fca5d5',
          400: '#f96cb7',
          500: '#f2429b',
          600: '#e22078',
          700: '#c4125e',
          800: '#a2124d',
          900: '#871443'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
}
