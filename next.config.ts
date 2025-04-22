import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "res.cloudinary.com" }]
  },
  headers: async () => [
      {
        "source": "/api/(.*)",
        "headers": [
          { "key": "Access-Control-Allow-Credentials", "value": "true" },
          { "key": "Access-Control-Allow-Origin", "value": process.env.MYORIGIN as string},
          { "key": "Access-Control-Allow-Methods", "value": "GET,POST" },
          { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
        ]
      }
    ]
};

export default nextConfig;
