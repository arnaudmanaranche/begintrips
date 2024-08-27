import { isPast, isToday, startOfDay, format, isValid } from 'date-fns'

export function stripTime(date: Date) {
  return startOfDay(date)
}

export const isInvalidDate = (date: Date) =>
  isPast(stripTime(date)) && !isToday(stripTime(date))

enum DATE_FORMAT {
  'EEEE - dd MMMM yyyy' = 'EEEE - dd MMMM yyyy',
  'dd/MM/yyyy' = 'dd/MM/yyyy',
  'EEEE dd MMMM' = 'EEEE dd MMMM',
  'yyyy-MM-dd' = 'yyyy-MM-dd',
  "yyyy-MM-dd'T'HH:mm:ss'Z'" = "yyyy-MM-dd'T'HH:mm:ss'Z'",
  'dd MMMM yyyy - HH:mm' = 'dd MMMM yyyy - HH:mm',
  'dd MMMM yyyy' = 'dd MMMM yyyy',
}

export const formatDate = (
  date: string | Date,
  dateFormat: keyof typeof DATE_FORMAT,
  shouldStripeTime = true
) => {
  let formatedDate = date

  if (!isValid(date)) {
    formatedDate = new Date(date)
  }

  if (shouldStripeTime) {
    return format(stripTime(formatedDate as Date), dateFormat)
  }

  return format(formatedDate as Date, dateFormat)
}
