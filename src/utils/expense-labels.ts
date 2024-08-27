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
  concert: '#4CAF50',
  event: '#F44336',
  hotel: '#FF9800',
  other: '#2196F3',
  restaurant: '#9C27B0',
  sport: '#FFC107',
  transport: '#3F51B5',
  museum: '#00BCD4',
  monument: '#E91E63',
  culture: '#795548',
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
