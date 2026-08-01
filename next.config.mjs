/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/demos/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, immutable" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/demos", destination: "/demos/gallery.html" },
      { source: "/demos/", destination: "/demos/gallery.html" },
    ];
  },
};

export default nextConfig;
