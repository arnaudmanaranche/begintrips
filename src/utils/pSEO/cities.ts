export const ONE_DAY_TRIP_FROM_CITIES = [
  'paris',
  'nyc',
  'los-angeles',
  'seattle',
  'atlanta',
  'chicago',
  'bangalore',
  'dallas',
  'london',
  'san-francisco',
  'bay-area',
]

export const VOYAGE_AU_DEPART_DE_CITIES = ['lille']

export const VOYAGE_PAS_CHER = ['europe']

type BlogListPerLocale = Record<
  string,
  { category: string; destinations: string[] }[]
>

export const BLOG_LIST_PER_LOCALE: BlogListPerLocale = {
  fr: [
    {
      category: 'voyage au depart de',
      destinations: VOYAGE_AU_DEPART_DE_CITIES,
    },
    {
      category: 'voyage pas cher',
      destinations: VOYAGE_PAS_CHER,
    },
  ],
  en: [
    { category: 'one day trip from', destinations: ONE_DAY_TRIP_FROM_CITIES },
  ],
}
