import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/product-info/material-info",
        destination: "/product-info/material-details",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
