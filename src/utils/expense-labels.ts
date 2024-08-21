import type { ExpenseCategoryEnum } from '@/types'

const emojisAssociated: Record<ExpenseCategoryEnum, string> = {
  concert: '🎵',
  event: '🎫',
  hotel: '🛏️',
  other: '🤷‍♂️',
  restaurant: '🍲',
  sport: '🏀',
  transport: '🚌',
  museum: '🖼️',
  monument: '🗿',
  culture: '🎭',
}

export const colorsAssociated: Record<ExpenseCategoryEnum, string> = {
  concert: '#9CA3AF',
  event: '#B55A5A',
  hotel: '#6B7280',
  other: '#D4A373',
  restaurant: '#556B2F',
  sport: '#4E7A73',
  transport: '#4C6A92',
  museum: '#9B6A6C',
  monument: '#737C94',
  culture: '#B58E4F',
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
