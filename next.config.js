/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/blog/:path*",
        destination: `${process.env.NEXT_PUBLIC_WORDPRESS_API}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
