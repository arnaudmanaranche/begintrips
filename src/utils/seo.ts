import { useIntl } from 'react-intl'

export const SITE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://begintrips.com'

export function useSiteTitle(): string {
  const intl = useIntl()

  return intl.formatMessage({
    id: 'siteTitle',
    defaultMessage: 'Begintrips - Simplify Your Journey',
  })
}

export function useSiteDescription(): string {
  const intl = useIntl()

  return intl.formatMessage({
    id: 'siteDescription',
    defaultMessage: 'Plan your journey',
  })
}
