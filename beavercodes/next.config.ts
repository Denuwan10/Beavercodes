import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three / drei ship modern ESM; transpiling keeps older Safari happy.
  transpilePackages: ["three"],
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    optimizePackageImports: ["@react-three/drei", "framer-motion", "gsap"],
  },
  async headers() {
    return [
      {
        // Long-lived caching for compressed 3D assets & HDRs.
        source: "/:dir(models|hdr)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
