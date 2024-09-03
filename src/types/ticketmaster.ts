export interface EventResponse {
  _embedded: {
    events: Event[]
  }
  page: PageInfo
  _links: Links
}

export interface Event {
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

export interface Image {
  ratio: string
  url: string
  width: number
  height: number
  fallback: boolean
}

export interface Sales {
  public?: PublicSales
  presales?: PreSale[]
}

export interface PublicSales {
  startDateTime?: string
  startTBD?: boolean
  endDateTime?: string
}

export interface PreSale {
  startDateTime: string
  endDateTime: string
  name: string
}

export interface EventDates {
  start: StartDates
  end?: EndDates
  timezone?: string
  spanMultipleDays?: boolean
}

export interface StartDates {
  localDate: string
  localTime?: string
  dateTime?: string
  dateTBD?: boolean
  dateTBA?: boolean
  timeTBA?: boolean
  noSpecificTime?: boolean
}

export interface EndDates {
  localDate: string
  localTime?: string
  dateTime?: string
}

export interface Classification {
  primary: boolean
  segment: Genre
  genre: Genre
  subGenre?: Genre
  type?: Genre
  subType?: Genre
  family: boolean
}

export interface Genre {
  id: string
  name: string
}

export interface Promoter {
  id: string
  name: string
  description: string
}

export interface PriceRange {
  type: string
  currency: string
  min: number
  max: number
}

export interface Product {
  id: string
  name: string
  url: string
  type: string
  classifications?: Classification[]
}

export interface SeatMap {
  staticUrl: string
}

export interface Accessibility {
  ticketLimit?: number
}

export interface TicketLimit {
  info: string
}

export interface AgeRestrictions {
  legalAgeEnforced: boolean
}

export interface PageInfo {
  size: number
  totalElements: number
  totalPages: number
  number: number
}

export interface Links {
  first?: Link
  self?: Link
  next?: Link
  last?: Link
}

export interface Link {
  href: string
}

export interface EmbeddedDetails {
  venues?: Venue[]
  attractions?: Attraction[]
}

export interface Venue {
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

export interface City {
  name: string
}

export interface State {
  name: string
  stateCode: string
}

export interface Country {
  name: string
  countryCode: string
}

export interface Address {
  line1: string
  line2?: string
}

export interface Location {
  longitude: string
  latitude: string
}

export interface Market {
  id: string
}

export interface Dma {
  id: number
}

export interface Social {
  twitter?: string
  facebook?: string
}

export interface BoxOfficeInfo {
  phoneNumberDetail?: string
  openHoursDetail?: string
  acceptedPaymentDetail?: string
  willCallDetail?: string
}

export interface GeneralInfo {
  generalRule?: string
  childRule?: string
}

export interface UpcomingEvents {
  _total: number
  ticketmaster?: number
  _filtered: number
}

export interface Attraction {
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

export interface ExternalLinks {
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

export interface ExternalLink {
  url: string
}
