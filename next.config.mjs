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
        source: '/blog/en/one-day-trip-from-:city',
        destination: '/blog/en/one-day-trip-from/:city',
      },
    ]
  },
}

export default nextConfig
