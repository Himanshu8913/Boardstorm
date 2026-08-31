/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        boardstorm: {
          bg: '#0f172a',
          surface: '#1e293b',
          accent: '#f59e0b',
          muted: '#94a3b8',
        },
      },
    },
  },
  plugins: [],
};
