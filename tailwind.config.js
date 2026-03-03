/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ue-white': '#F9F9F9',
        'ue-surface': '#FFFFFF',
        'ue-text': '#131819',
        'ue-muted': '#9799AB',
        'ue-red-800': '#940E20',
        'ue-red-700': '#6F0714',
        'ue-red-500': '#F82F28',
        'ue-border': '#E9E9EE',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', '"Noto Sans"', '"Helvetica Neue"', 'sans-serif'],
      },
      ringColor: {
        'ue-focus': 'rgba(248, 47, 40, 0.35)',
      },
    },
  },
  plugins: [],
}

