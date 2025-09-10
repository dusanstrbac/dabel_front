/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vaša postojeća konfiguracija
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
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
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

module.exports = nextConfig;