// next.config.mjs

export default {
    async rewrites() {
      return [
        {
          source: '/api/:path*', // Match API requests
          destination: 'https://astrotalk-backend.onrender.com/:path*', // Forward to your backend
        },
      ];
    },
  };
  