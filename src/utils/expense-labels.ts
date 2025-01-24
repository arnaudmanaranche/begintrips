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

export const colorsAssociated: Record<string, string> = {
  attraction: '#A96A5B', // Muted reddish brown
  bar: '#6D4423', // Muted brown
  bike: '#A96A5B', // Similar muted reddish brown as 'attraction'
  bus: '#705634', // Muted olive brown
  car: '#6C7C96', // Muted steel blue
  coffee: '#5B6652', // Muted sage green
  concert: '#739772', // Muted green
  culture: '#8B6A5B', // Muted taupe
  event: '#875D5A', // Muted warm brown
  ferry: '#7C898B', // Muted slate gray
  flight: '#725C9C', // Muted lavender
  food: '#6E8A6D', // Muted olive green
  gas: '#B4A65B', // Muted goldenrod
  grocery: '#8D9E79', // Muted gray-green
  hotel: '#A27B4F', // Muted tan
  metro: '#61688C', // Muted indigo
  monument: '#89637B', // Muted plum
  movie: '#A68852', // Muted ochre
  museum: '#6093A3', // Muted teal
  other: '#567985', // Muted blue-gray
  parking: '#7B8A8E', // Muted slate
  restaurant: '#845B8D', // Muted violet
  shopping: '#7F8B65', // Muted moss green
  sport: '#9B8856', // Muted mustard
  taxi: '#9E7D70', // Muted dusty rose
  train: '#657A96', // Muted denim
  transport: '#5F647A', // Muted navy
}

const mappedExpensesWithEmojis = (
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
