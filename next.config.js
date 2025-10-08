// next.config.ts
/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const locales = ['sr', 'en', 'mk', 'al', 'me'];
const defaultLocale = 'sr';

const withNextIntl = createNextIntlPlugin({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '94.230.179.194',
        port: '8443',
        pathname: '/SlikeProizvoda/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/auth/login",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);