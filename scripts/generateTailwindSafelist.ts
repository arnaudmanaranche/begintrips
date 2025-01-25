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
  // Budget
  '#4CAF50',
  '#FFA500',
  '#FF0000',
]

export const generateTailwindSafelist = (): string[] => {
  const safelist: string[] = []

  colors.forEach((color) => {
    safelist.push(`bg-[${color}]`)
    safelist.push(`text-[${color}]`)
    safelist.push(`border-[${color}]`)
    safelist.push(`stroke-[${color}]`)
  })

  return safelist
}
