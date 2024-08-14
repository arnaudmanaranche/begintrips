import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-[#6B7280]',
    'bg-[#4C6A92]',
    'bg-[#9CA3AF]',
    'bg-[#556B2F]',
    'bg-[#7B8A8B]',
    'bg-[#8C5A62]',
    'bg-[#A68B7C]',
    'border-[#6B7280]',
    'border-[#4C6A92]',
    'border-[#9CA3AF]',
    'border-[#556B2F]',
    'border-[#7B8A8B]',
    'border-[#8C5A62]',
    'border-[#A68B7C]',
  ],
  theme: {
    extend: {
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
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      colors: {
        primary: {
          light: '#7DD3FC',
          DEFAULT: '#0EA5E9',
          dark: '#0369A1',
        },
        secondary: {
          light: '#86EFAC',
          DEFAULT: '#22C55E',
          dark: '#15803D',
        },
        accent: {
          light: '#FDBA74',
          DEFAULT: '#FB923C',
          dark: '#EA580C',
        },
        neutral: {
          light: '#F3F4F6',
          DEFAULT: '#D1D5DB',
          dark: '#9CA3AF',
        },
        warning: {
          light: '#FECACA',
          DEFAULT: '#F87171',
          dark: '#B91C1C',
        },
        success: {
          light: '#BBF7D0',
          DEFAULT: '#4ADE80',
          dark: '#16A34A',
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
}
export default config
