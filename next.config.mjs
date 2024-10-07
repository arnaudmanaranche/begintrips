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
}

export default nextConfig
