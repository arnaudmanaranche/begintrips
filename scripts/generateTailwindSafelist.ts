const colors = [
  '#FF5722',
  '#E65100',
  '#FF5722',
  '#E65100',
  '#7986CB',
  '#7986CB',
  '#4CAF50',
  '#795548',
  '#F44336',
  '#607D8B',
  '#673AB7',
  '#4CAF50',
  '#FFEB3B',
  '#4CAF50',
  '#FF9800',
  '#3F51B5',
  '#E91E63',
  '#FF9800',
  '#00BCD4',
  '#2196F3',
  '#607D8B',
  '#9C27B0',
  '#8BC34A',
  '#FFC107',
  '#E91E63',
  '#2196F3',
  '#3F51B5',
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
