/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  // Don't fail production builds on ESLint warnings (e.g. <img> hints)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
