import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/pacman',
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
    ];
  },
};

export default nextConfig;
