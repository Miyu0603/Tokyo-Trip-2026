/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tokyo: {
          red: '#C93630',
          paper: '#F7F6F2',
          ink: '#2B2B2B',
          gold: '#C59D5F',
          matcha: '#6A7F60',
          sakura: '#F2D3D9',
          gray: '#949495',
          indigo: '#2E3A53',
          anbao: '#F472B6',
          tingbao: '#FB923C',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', 'serif'],
        sans: ['"Noto Sans JP"', '"Noto Sans TC"', 'sans-serif'],
      },
      boxShadow: {
        'paper': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'float': '0 4px 0px rgba(0, 0, 0, 0.1)',
      }
    }
  },
  plugins: [],
}