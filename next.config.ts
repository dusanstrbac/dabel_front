// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/api/auth/login",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Omogućite sve izvore, možete postaviti specifične izvore kao localhost:3000
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
