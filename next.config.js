/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply cache headers to all video files in the /bg directory
        source: '/bg/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=0, s-maxage=86400, stale-while-revalidate=604800',
          },
          {
            key: 'Content-Type',
            value: 'video/mp4',
          },
        ],
      },
      {
        // Apply cache headers to poster image
        source: '/bg-poster.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=0, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
