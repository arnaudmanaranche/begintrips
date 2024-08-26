export const hasJourneyPassed = (departureDate: Date) => {
  const todayDate = new Date()

  return todayDate > departureDate
}
