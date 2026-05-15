/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#00ff88',
        dark: { 900: '#0a0a0f', 800: '#12121a', 700: '#1a1a2e', 600: '#16213e' },
      },
    },
  },
  plugins: [],
};
