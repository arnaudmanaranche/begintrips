import { format, isPast, isToday, isValid, startOfDay } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import { useRouter } from 'next/router'

export function stripTime(date: Date): Date {
  return startOfDay(date)
}

export const isInvalidDate = (date: Date): boolean =>
  isPast(stripTime(date)) && !isToday(stripTime(date))

type DateFormatEnumType =
  | 'EEEE, dd MMMM yyyy'
  | 'dd/MM/yyyy'
  | 'EEEE dd MMMM'
  | 'yyyy-MM-dd'
  | "yyyy-MM-dd'T'HH:mm:ss'Z'"
  | 'dd MMMM yyyy - HH:mm'
  | 'dd MMMM yyyy HH:mm'
  | 'dd MMMM yyyy'
  | 'dd MMM yyyy'
  | 'dd MMM'

export const formatDate = (
  date: string | Date,
  dateFormat: DateFormatEnumType,
  shouldStripeTime = true,
  locale = 'en'
): string => {
  let formatedDate = date
  const dateLocale = locale === 'fr' ? fr : enUS

  if (!isValid(date)) {
    formatedDate = new Date(date)
  }

  if (shouldStripeTime) {
    return format(stripTime(formatedDate as Date), dateFormat, {
      locale: dateLocale,
    })
  }

  return format(formatedDate as Date, dateFormat, {
    locale: dateLocale,
  })
}
