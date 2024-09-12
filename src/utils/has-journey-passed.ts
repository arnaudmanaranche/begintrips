import { stripTime } from './date'

export const hasJourneyPassed = (departureDate: Date): boolean => {
  const todayDate = new Date()

  return stripTime(todayDate) > stripTime(departureDate)
}
