import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["xlsx", "pdfjs-dist"],
  async redirects() {
    return [
      {
        source: "/ordering-installation/radius-calculator",
        destination: "/ordering-installation/flex-trim-toolbox",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
