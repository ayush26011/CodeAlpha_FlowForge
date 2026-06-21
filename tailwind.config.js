/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        'smoky':       '#11120D',
        'olive':       '#6B6659',
        'olive-light': '#8A8675',
        'bone':        '#D8CFBC',
        'floral':      '#FFFBF4',
        // Bronze scale
        'bronze':      '#9B8260',
        'bronze-light':'#B8975A',
        'bronze-dark': '#7A6245',
        'bronze-glow': 'rgba(155,130,96,0.18)',
        // Surface layers (dark → light)
        'surface':     '#161710',
        'surface-2':   '#1E2018',
        'surface-3':   '#262820',
        'surface-4':   '#2E3028',
        'muted':       '#3D3E36',
        // Borders
        'border':      '#2A2C22',
        'border-light':'#363830',
        'border-focus':'rgba(155,130,96,0.5)',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        // Layered card depths
        'xs':          '0 1px 2px rgba(0,0,0,0.3)',
        'card':        '0 1px 3px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
        'card-hover':  '0 4px 16px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-raised': '0 8px 32px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        'modal':       '0 24px 80px rgba(0,0,0,0.75), 0 8px 32px rgba(0,0,0,0.5)',
        'sidebar':     '1px 0 0 rgba(255,255,255,0.04)',
        'glow':        '0 0 24px rgba(155,130,96,0.18), 0 0 8px rgba(155,130,96,0.1)',
        'glow-sm':     '0 0 12px rgba(155,130,96,0.14)',
        'inner':       'inset 0 1px 3px rgba(0,0,0,0.4)',
        'topbar':      '0 1px 0 rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        'sm':  '6px',
        'DEFAULT': '8px',
        'md':  '10px',
        'lg':  '12px',
        'xl':  '14px',
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      backgroundImage: {
        // Subtle gradient overlays
        'surface-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0) 100%)',
        'bronze-gradient':  'linear-gradient(135deg, #B8975A 0%, #7A6245 100%)',
        'shimmer':          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
        'noise':            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      animation: {
        'pulse-slow':    'pulse 3s ease-in-out infinite',
        'fade-in':       'fadeIn 0.25s ease-out',
        'slide-up':      'slideUp 0.25s ease-out',
        'slide-down':    'slideDown 0.25s ease-out',
        'scale-in':      'scaleIn 0.2s ease-out',
        'shimmer':       'shimmer 1.6s ease-in-out infinite',
        'float':         'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:   { '0%': { opacity: '0' },                                    '100%': { opacity: '1' } },
        slideUp:  { '0%': { opacity: '0', transform: 'translateY(10px)' },     '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown:{ '0%': { opacity: '0', transform: 'translateY(-10px)' },    '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:  { '0%': { opacity: '0', transform: 'scale(0.96)' },          '100%': { opacity: '1', transform: 'scale(1)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:    { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      backdropBlur: {
        xs: '2px',
        sm: '6px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
