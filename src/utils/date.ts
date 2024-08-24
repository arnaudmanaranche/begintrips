import { startOfDay } from 'date-fns'

export function stripTime(date: Date) {
  return startOfDay(date)
}
