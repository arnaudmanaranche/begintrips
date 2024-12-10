// const colors = [
//   '#FF5722',
//   '#E65100',
//   '#FF5722',
//   '#E65100',
//   '#7986CB',
//   '#7986CB',
//   '#4CAF50',
//   '#795548',
//   '#F44336',
//   '#607D8B',
//   '#673AB7',
//   '#4CAF50',
//   '#FFEB3B',
//   '#4CAF50',
//   '#FF9800',
//   '#3F51B5',
//   '#E91E63',
//   '#FF9800',
//   '#00BCD4',
//   '#2196F3',
//   '#607D8B',
//   '#9C27B0',
//   '#8BC34A',
//   '#FFC107',
//   '#E91E63',
//   '#2196F3',
//   '#3F51B5',
// ]

const colors = [
  '#A96A5B',
  '#6D4423',
  '#A96A5B',
  '#705634',
  '#6C7C96',
  '#5B6652',
  '#739772',
  '#8B6A5B',
  '#875D5A',
  '#7C898B',
  '#725C9C',
  '#6E8A6D',
  '#B4A65B',
  '#8D9E79',
  '#A27B4F',
  '#61688C',
  '#89637B',
  '#A68852',
  '#6093A3',
  '#567985',
  '#7B8A8E',
  '#845B8D',
  '#7F8B65',
  '#9B8856',
  '#9E7D70',
  '#657A96',
  '#5F647A',
]

export const generateTailwindSafelist = (): string[] => {
  const safelist: string[] = []

  colors.forEach((color) => {
    safelist.push(`bg-[${color}]`)
    safelist.push(`text-[${color}]`)
    safelist.push(`border-[${color}]`)
  })

  return safelist
}
