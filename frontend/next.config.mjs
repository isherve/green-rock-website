/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.vercel.app" },
      { protocol: "http", hostname: "localhost", port: "5000", pathname: "/uploads/**" },
    ],
  },
  async rewrites() {
    if (process.env.VERCEL) return [];
    return [
      { source: "/api/:path*", destination: "http://localhost:5000/api/:path*" },
      { source: "/health", destination: "http://localhost:5000/health" },
    ];
  },
};

export default nextConfig;
