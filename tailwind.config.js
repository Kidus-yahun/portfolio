/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#060913',
        surface: '#0d111e',
        midnight: '#060913',
        electric: {
          DEFAULT: '#0091ff',
          hover: '#00a8ff',
          glow: 'rgba(0, 145, 255, 0.4)'
        },
        accent: {
          DEFAULT: '#ff5c3d',
          hover: '#ff7a5f',
          glow: 'rgba(255, 92, 61, 0.4)'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      keyframes: {
        'halo': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(2.2)', opacity: '0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        'halo': 'halo 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 4s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};
