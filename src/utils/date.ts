import { isPast, isToday, startOfDay } from 'date-fns'

export function stripTime(date: Date) {
  return startOfDay(date)
}

export const isInvalidDate = (date: Date) =>
  isPast(stripTime(date)) && !isToday(stripTime(date))
