import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/messages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#05070d',
          800: '#0a0e1a',
          700: '#111726',
          600: '#1a2236',
        },
        accent: {
          DEFAULT: '#22d3ee',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        violet: {
          DEFAULT: '#8b5cf6',
        },
        magenta: {
          DEFAULT: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, transparent, rgba(5,7,13,0.9) 75%), linear-gradient(rgba(34,211,238,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.07) 1px, transparent 1px)',
      },
      keyframes: {
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'blur(40px)' },
          '50%': { opacity: '1', filter: 'blur(60px)' },
        },
      },
      animation: {
        'gradient-pan': 'gradient-pan 8s ease infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
