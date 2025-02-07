import { useIntl } from 'react-intl'

export const SITE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://www.begintrips.com'

export function useSiteTitle(): string {
  const intl = useIntl()

  return intl.formatMessage({
    id: 'siteTitle',
    defaultMessage: 'Begintrips - Plan in minutes. Travel stress-free',
  })
}

export function useSiteDescription(): string {
  const intl = useIntl()

  return intl.formatMessage({
    id: 'siteDescription',
    defaultMessage:
      'Plan your journey day by day, track your expenses by category, and keep all your travel details organized in one place',
  })
}

export const COMPETITORS_NAMES = [
  'tripit',
  'stippl',
  'checkmytrip',
  'wanderlog',
]
