import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;


const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
  trailingSlash: true,  // Ensure proper static routing on GitHub Pages
};
