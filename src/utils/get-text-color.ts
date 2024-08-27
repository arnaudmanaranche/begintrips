/**
 * Converts a hex color to RGB components.
 * @param hex - The hex color code (e.g., "#4CAF50").
 * @returns An array containing the RGB components [R, G, B].
 */
function hexToRgb(hex: string): [number, number, number] {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b)

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0]
}

/**
 * Calculates the relative luminance of an RGB color.
 * @param rgb - An array containing the RGB components [R, G, B].
 * @returns The luminance value.
 */
function luminance([r, g, b]: [number, number, number]): number {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

/**
 * Determines if white or black text is better for contrast with the background color.
 * @param hex - The background color in hex format.
 * @returns "white" or "black" depending on which provides better contrast.
 */
export function getTextColor(hex: string): 'white' | 'black' {
  const rgb = hexToRgb(hex)
  const lum = luminance(rgb)
  return lum > 0.179 ? 'black' : 'white'
}
