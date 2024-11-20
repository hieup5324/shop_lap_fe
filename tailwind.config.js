/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true, // to generate utilities as !important
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif']
      },
      colors: { // custom color palette
        primary: '#ea580c',
        secondary: '#2563eb',
        violet: '#883677',
        congo: '##FF958C',
        success: '#22c55e',
        warning: '#FFA600',
        danger: '#dc2626',
        dark: '#2E3A44',
        info: '#1CA7EC',
        black: '#2E3A44',
        grey1: '#A0AABF',
        grey2: '#C0C6D4',
        grey3: '#E3E8F1',
        light: '#F9FBFC',
        white: '#FFF'
      }
    },
  },
  plugins: [],
  corePlugins: {
    // preflight: false,
  }
}