export interface EventResponse {
  _embedded: {
    events: Event[]
  }
  page: PageInfo
  _links: Links
}

interface Event {
  name: string
  type: string
  id: string
  test: boolean
  url: string
  locale: string
  images?: Image[]
  sales?: Sales
  dates?: EventDates
  classifications?: Classification[]
  promoter?: Promoter
  promoters?: Promoter[]
  info?: string
  pleaseNote?: string
  priceRanges?: PriceRange[]
  products?: Product[]
  seatmap?: SeatMap
  accessibility?: Accessibility
  ticketLimit?: TicketLimit
  ageRestrictions?: AgeRestrictions
  _links?: Links
  _embedded?: EmbeddedDetails
}

interface Image {
  ratio: string
  url: string
  width: number
  height: number
  fallback: boolean
}

interface Sales {
  public?: PublicSales
  presales?: PreSale[]
}

interface PublicSales {
  startDateTime?: string
  startTBD?: boolean
  endDateTime?: string
}

interface PreSale {
  startDateTime: string
  endDateTime: string
  name: string
}

interface EventDates {
  start: StartDates
  end?: EndDates
  timezone?: string
  spanMultipleDays?: boolean
}

interface StartDates {
  localDate: string
  localTime?: string
  dateTime?: string
  dateTBD?: boolean
  dateTBA?: boolean
  timeTBA?: boolean
  noSpecificTime?: boolean
}

interface EndDates {
  localDate: string
  localTime?: string
  dateTime?: string
}

interface Classification {
  primary: boolean
  segment: Genre
  genre: Genre
  subGenre?: Genre
  type?: Genre
  subType?: Genre
  family: boolean
}

interface Genre {
  id: string
  name: string
}

interface Promoter {
  id: string
  name: string
  description: string
}

interface PriceRange {
  type: string
  currency: string
  min: number
  max: number
}

interface Product {
  id: string
  name: string
  url: string
  type: string
  classifications?: Classification[]
}

interface SeatMap {
  staticUrl: string
}

interface Accessibility {
  ticketLimit?: number
}

interface TicketLimit {
  info: string
}

interface AgeRestrictions {
  legalAgeEnforced: boolean
}

interface PageInfo {
  size: number
  totalElements: number
  totalPages: number
  number: number
}

interface Links {
  first?: Link
  self?: Link
  next?: Link
  last?: Link
}

interface Link {
  href: string
}

interface EmbeddedDetails {
  venues?: Venue[]
  attractions?: Attraction[]
}

interface Venue {
  name: string
  type: string
  id: string
  test: boolean
  url: string
  locale: string
  images?: Image[]
  postalCode?: string
  timezone?: string
  city?: City
  state?: State
  country?: Country
  address?: Address
  location?: Location
  markets?: Market[]
  dmas?: Dma[]
  social?: Social
  boxOfficeInfo?: BoxOfficeInfo
  parkingDetail?: string
  accessibleSeatingDetail?: string
  generalInfo?: GeneralInfo
  upcomingEvents?: UpcomingEvents
  _links?: Links
}

interface City {
  name: string
}

interface State {
  name: string
  stateCode: string
}

interface Country {
  name: string
  countryCode: string
}

interface Address {
  line1: string
  line2?: string
}

interface Location {
  longitude: string
  latitude: string
}

interface Market {
  id: string
}

interface Dma {
  id: number
}

interface Social {
  twitter?: string
  facebook?: string
}

interface BoxOfficeInfo {
  phoneNumberDetail?: string
  openHoursDetail?: string
  acceptedPaymentDetail?: string
  willCallDetail?: string
}

interface GeneralInfo {
  generalRule?: string
  childRule?: string
}

interface UpcomingEvents {
  _total: number
  ticketmaster?: number
  _filtered: number
}

interface Attraction {
  name: string
  type: string
  id: string
  test: boolean
  url: string
  locale: string
  externalLinks?: ExternalLinks
  images?: Image[]
  classifications?: Classification[]
  upcomingEvents?: UpcomingEvents
  _links?: Links
}

interface ExternalLinks {
  youtube?: ExternalLink[]
  twitter?: ExternalLink[]
  facebook?: ExternalLink[]
  instagram?: ExternalLink[]
  wiki?: ExternalLink[]
  homepage?: ExternalLink[]
  itunes?: ExternalLink[]
  lastfm?: ExternalLink[]
  spotify?: ExternalLink[]
  musicbrainz?: ExternalLink[]
}

interface ExternalLink {
  url: string
}
