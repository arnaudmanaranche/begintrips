import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-[#4CAF50]',
    'bg-[#F44336]',
    'bg-[#FF9800]',
    'bg-[#2196F3]',
    'bg-[#9C27B0]',
    'bg-[#FFC107]',
    'bg-[#3F51B5]',
    'bg-[#00BCD4]',
    'bg-[#E91E63]',
    'bg-[#795548]',
    'ring-[#4CAF50]',
    'ring-[#F44336]',
    'ring-[#FF9800]',
    'ring-[#2196F3]',
    'ring-[#9C27B0]',
    'ring-[#FFC107]',
    'ring-[#3F51B5]',
    'ring-[#00BCD4]',
    'ring-[#E91E63]',
    'ring-[#795548]',
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
