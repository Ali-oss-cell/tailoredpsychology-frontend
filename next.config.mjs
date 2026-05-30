/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api"
    const backendOrigin = apiBase.replace(/\/api\/?$/, "")
    return [
      {
        source: "/socket.io/:path*",
        destination: `${backendOrigin}/socket.io/:path*`,
      },
    ]
  },
}

export default nextConfig
