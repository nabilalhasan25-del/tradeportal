import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Removed output: 'standalone' for easier local IIS deployment
  webpack: (config: any) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  experimental: {
    // Keep experimental empty or add other experimental flags here
  },
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.js',
    },
  },
} as any;

export default nextConfig;
