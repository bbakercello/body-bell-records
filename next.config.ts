import type { NextConfig } from "next";

<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export', // Export as a static site
  basePath: isProd ? '/body-bell-records' : '', // Use repository name in production
  assetPrefix: isProd ? '/body-bell-records/' : '', // Ensure assets load correctly on GitHub Pages
  trailingSlash: true, // Each route ends with a trailing slash for GitHub Pages compatibility
};

module.exports = nextConfig;
=======
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;


const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  basePath: isProd ? '/body-bell-records' : '',
};
>>>>>>> dev