import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // reactStrictMode: false,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/games/pacman',
        statusCode: 307,
      },
      {
        source: '/games',
        destination: '/games/pacman',
        statusCode: 307,
      },
      {
        source: '/particles',
        destination: '/particles/constellation',
        statusCode: 307,
      },
      {
        source: '/circles',
        destination: '/circles/trail',
        statusCode: 307,
      },
      {
        source: '/other',
        destination: '/other/matrix',
        statusCode: 307,
      },
    ];
  },
};

export default nextConfig;
