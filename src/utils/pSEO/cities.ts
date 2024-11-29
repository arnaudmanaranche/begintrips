const ONE_DAY_TRIP_FROM_CITIES = [
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

const VOYAGE_AU_DEPART_DE_CITIES = ['lille']

const VOYAGE_PAS_CHER = ['europe']

const MARCHE_DE_NOEL = [
  'strasbourg',
  'rennes',
  'colmar',
  'paris',
  'lyon',
  'lille',
]

const CHRISTMAS_MARKET = ['koziars', 'seattle']

type BlogListPerLocale = Record<
  string,
  { title: string; category: string; destinations: string[] }[]
>

export const BLOG_LIST_PER_LOCALE: BlogListPerLocale = {
  fr: [
    {
      title: 'Voyage au départ de',
      category: 'voyage-au-depart-de',
      destinations: VOYAGE_AU_DEPART_DE_CITIES,
    },
    {
      title: 'Voyage pas cher',
      category: 'voyage-pas-cher',
      destinations: VOYAGE_PAS_CHER,
    },
    {
      title: 'Marché de Noël',
      category: 'noel',
      destinations: MARCHE_DE_NOEL,
    },
  ],
  en: [
    {
      title: 'One day trip from',
      category: 'one-day-trip-from',
      destinations: ONE_DAY_TRIP_FROM_CITIES,
    },
    {
      title: 'Christmas market',
      category: 'christmas',
      destinations: CHRISTMAS_MARKET,
    },
  ],
}
