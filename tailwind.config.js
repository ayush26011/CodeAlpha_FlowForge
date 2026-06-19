/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'smoky': '#11120D',
        'olive': '#565449',
        'bone': '#D8CFBC',
        'floral': '#FFFBF4',
        'bronze': '#8B7355',
        'bronze-light': '#A68B5B',
        'bronze-dark': '#6B5840',
        'surface': '#1A1B16',
        'surface-2': '#22231D',
        'surface-3': '#2A2B24',
        'muted': '#3D3E36',
        'border': '#2E2F28',
        'border-light': '#3A3B33',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.4)',
        'modal': '0 20px 60px rgba(0,0,0,0.7)',
        'sidebar': '1px 0 0 rgba(255,255,255,0.05)',
        'glow': '0 0 20px rgba(139,115,85,0.15)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
