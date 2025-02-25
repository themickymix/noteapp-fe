/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",  
        destination: "https://note-be-ql9a.onrender.com/api/:path*", 
      },
    ];
  },
};

module.exports = nextConfig;