import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (
    config, options
  ) => {
      // Important: return the modified config
      config.module.rules.push({
          test: /\.node/,
          use: 'raw-loader',
      });
      return config;
  }
};

export default nextConfig;
