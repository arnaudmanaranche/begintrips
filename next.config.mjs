/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's1.ticketm.net',
        port: '',
      },
    ],
  },
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
  rewrites: async () => {
    return [
      {
        source: '/blog/one-day-trip-from-:city',
        destination: '/blog/one-day-trip-from/:city',
      },
      {
        source: '/blog/voyage-au-depart-de-:city',
        destination: '/blog/voyage-au-depart-de/:city',
      },
      {
        source: '/blog/voyage-pas-cher-:destination',
        destination: '/blog/voyage-pas-cher/:destination',
      },
    ]
  },
}

export default nextConfig
