import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio estático: `next build` genera la carpeta `out/`, sin servidor.
  output: "export",
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
