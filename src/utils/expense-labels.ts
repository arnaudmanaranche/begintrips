import type { ExpenseCategoryEnum } from '@/types'

const emojisAssociated: Record<ExpenseCategoryEnum, string> = {
  attraction: '🎡',
  bar: '🍻',
  bike: '🚲',
  bus: '🚌',
  car: '🚗',
  coffee: '☕',
  concert: '🎵',
  culture: '🎭',
  event: '🎫',
  ferry: '⛴️',
  flight: '🛫',
  food: '🍽️',
  gas: '⛽',
  grocery: '🛒',
  hotel: '🛏️',
  metro: '🚇',
  monument: '🗿',
  movie: '🎥',
  museum: '🖼️',
  other: '🤷‍♂️',
  parking: '🅿️',
  restaurant: '🍲',
  shopping: '🛍️',
  sport: '🏀',
  taxi: '🚕',
  train: '🚂',
  transport: '🚌',
}

export const colorsAssociated: Record<ExpenseCategoryEnum, string> = {
  attraction: '#FF5722',
  bar: '#E65100',
  bike: '#FF5722',
  bus: '#E65100',
  car: '#7986CB',
  coffee: '#7986CB',
  concert: '#4CAF50',
  culture: '#795548',
  event: '#F44336',
  ferry: '#607D8B',
  flight: '#673AB7',
  food: '#4CAF50',
  gas: '#FFEB3B',
  grocery: '#4CAF50',
  hotel: '#FF9800',
  metro: '#3F51B5',
  monument: '#E91E63',
  movie: '#FF9800',
  museum: '#00BCD4',
  other: '#2196F3',
  parking: '#607D8B',
  restaurant: '#9C27B0',
  shopping: '#8BC34A',
  sport: '#FFC107',
  taxi: '#E91E63',
  train: '#2196F3',
  transport: '#3F51B5',
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
