import type { ExpenseCategoryEnum } from '@/types'

const emojisAssociated: Record<ExpenseCategoryEnum, string> = {
  concert: '🎵',
  event: '🎫',
  hotel: '🛏️',
  other: '🤷‍♂️',
  restaurant: '🍲',
  sport: '🏀',
  transport: '🚌',
}

export const colorsAssociated: Record<ExpenseCategoryEnum, string> = {
  concert: '#9CA3AF',
  event: '#8C5A62',
  hotel: '#6B7280',
  other: '#A68B7C',
  restaurant: '#556B2F',
  sport: '#7B8A8B',
  transport: '#4C6A92',
}

export const mappedExpensesWithEmojis = (
  Object.keys(emojisAssociated) as Array<keyof typeof emojisAssociated>
).map((key) => {
  return {
    name: key,
    category: key,
    emoji: emojisAssociated[key],
  }
})

export const mappedExpensesWithColors = mappedExpensesWithEmojis.map(
  (expense) => ({
    ...expense,
    color: colorsAssociated[expense.category],
  })
)
