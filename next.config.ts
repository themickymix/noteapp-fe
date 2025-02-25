import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",  
        destination: "https://note-be-ql9a.onrender.com/api/:path*", 
      },
    ];
  },
};

export default nextConfig;