/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        game: {
          dark: '#0a0a14',
          card: '#121226',
          border: '#232342',
          neon: {
            cyan: '#00f2fe',
            purple: '#9d4edd',
            pink: '#ff007f',
            green: '#00ff88',
            yellow: '#ffbe0b'
          }
        }
      },
      fontFamily: {
        gaming: ['Orbitron', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 15px rgba(0, 242, 254, 0.6))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(157, 78, 221, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
