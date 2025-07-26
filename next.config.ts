import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/games/pacman',
        permanent: true,
      },
      {
        source: '/games',
        destination: '/games/pacman',
        permanent: true,
      },
      {
        source: '/particles',
        destination: '/particles/constellation',
        permanent: true,
      },
      {
        source: '/circles',
        destination: '/circles/trail',
        permanent: true,
      },
      {
        source: '/other',
        destination: '/other/matrix',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
