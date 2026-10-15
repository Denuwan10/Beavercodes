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
        // Long-lived caching for compressed 3D assets, HDRs and the beaver
        // frames (all requested with a ?v= version, bumped when they change).
        source: "/:dir(models|hdr|beaver-sweep)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Security headers on every response. HTTPS itself (the padlock) is
        // provided automatically by the host; HSTS tells browsers to always
        // use it. No includeSubDomains: mail/webmail subdomains live elsewhere.
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
