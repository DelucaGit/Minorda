import type { NextConfig } from "next";

// cacheComponents is intentionally off. The /cart page must paint its line
// items without JavaScript, and Cache Components would stream request-time
// data (the cart cookie) behind a Suspense fallback.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
