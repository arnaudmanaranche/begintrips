export function generateDateArray(
  departureDate: string,
  returnDate: string
): string[] {
  const start = new Date(departureDate)
  const end = new Date(returnDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error(
      'Invalid date format. Please provide dates in YYYY-MM-DD format.'
    )
  }

  if (start > end) {
    throw new Error('Departure date must be before or equal to return date.')
  }

  const dates: string[] = []
  const currentDate = new Date(start)

  while (currentDate <= end) {
    dates.push(currentDate.toISOString().split('T')[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}
