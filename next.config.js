/**
 * Next.js config for Elite Travel XP (Hostinger-safe).
 *
 * Build uses Webpack (see package.json → `next build --webpack`) because
 * Hostinger's GLIBC cannot load native Turbopack / SWC binaries.
 *
 * `/blog/:path*` rewrites to the Headless WordPress REST API so the browser
 * can fetch posts without CORS issues.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'travelexperiencesgroup.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tokiotours.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'elitetravelexp.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const wordpressApi = (
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
      "https://travelexperiencesgroup.com/blog/wp-json/wp/v2"
    ).replace(/\/$/, "");

    return [
      {
        source: "/blog/:path*",
        destination: `${wordpressApi}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
