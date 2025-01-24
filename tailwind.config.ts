import type { Config } from 'tailwindcss'

import { generateTailwindSafelist } from './scripts/generateTailwindSafelist'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  safelist: generateTailwindSafelist(),
  prefix: '',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-open-sans)', 'sans-serif'],
        serif: ['var(--font-outfit)', 'serif'],
      },
      keyframes: {
        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        contentShow: {
          from: {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.96)',
          },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        slideRightAndFade: {
          from: { opacity: '0', transform: 'translateX(-2px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade:
          'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      colors: {
        black: '#151035',
        info: {
          light: '#BFDBFE',
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
        },
        primary: {
          DEFAULT: '#F85231',
          light: '#FF6E4E',
          dark: '#D64326',
        },
        accent: {
          base: '#113B57',
          light: '#1A4867',
          dark: '#0D3553',
        },
        neutral: {
          base: '#4E5C69',
          light: '#6B7985',
          dark: '#3C4854',
        },
        background: {
          light: '#F8FAFC',
          dark: '#1E293B',
        },
        muted: '#485763',
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
