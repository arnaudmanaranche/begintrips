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
        accent: {
          light: '#FDBA74',
          DEFAULT: '#E3461E',
          dark: '#EA580C',
        },
        neutral: {
          light: '#F3F4F6',
          DEFAULT: '#D1D5DB',
          dark: '#9CA3AF',
        },
        info: {
          light: '#BFDBFE',
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
        },
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
