const SITE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://planner.enaut.dev'

const PATHS_TO_EXCLUDE = ['/account', '/my-journeys', '/onboarding', '/welcome']

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: PATHS_TO_EXCLUDE,
  alternateRefs: [
    {
      href: SITE_URL,
      hreflang: 'en',
    },
    {
      href: `${SITE_URL}/fr`,
      hreflang: 'fr',
    },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: PATHS_TO_EXCLUDE,
      },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}
