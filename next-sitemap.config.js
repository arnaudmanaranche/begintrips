const SITE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://begintrips.com'

const PATHS_TO_EXCLUDE = ['/account', '/my-journeys', '/onboarding', '/welcome']

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: PATHS_TO_EXCLUDE,
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
