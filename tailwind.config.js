/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f4f4f5',
          900: '#121214',
          950: '#0b0b0d',
        },
      },
    },
  },
  plugins: [],
};
