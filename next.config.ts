import type { NextConfig } from "next";

const wordpressApi = process.env.NEXT_PUBLIC_WORDPRESS_API ?? "";

function wordpressHostname(): string {
  try {
    return new URL(wordpressApi).hostname;
  } catch {
    return "localhost";
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: wordpressHostname(),
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: wordpressHostname(),
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.wp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    if (!wordpressApi) return [];

    return [
      {
        source: "/blog/:path*",
        destination: `${wordpressApi}/:path*`,
      },
    ];
  },
};

export default nextConfig;
