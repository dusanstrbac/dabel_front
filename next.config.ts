/** @type {import('next').NextConfig} */
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
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**', // samo ako imaš više lokalnih IP-a (nije zvanično podržano)
        pathname: '/**',
      },
    ],
  },

  webpack(config: { module: { rules: { test: RegExp; use: { loader: string; }; }[]; }; }) {
    // Dodaj worker-loader za pdf.worker.js
    config.module.rules.push({
      test: /pdf\.worker\.js$/,
      use: { loader: 'worker-loader' },
    });
    return config;
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
