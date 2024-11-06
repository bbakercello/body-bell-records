import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Ensures Next.js exports as a static site
  basePath: '/body-bell-records', // Replace with your repository name
  assetPrefix: '/body-bell-records/',
  trailingSlash: true, // Ensures each route has a trailing slash (important for static hosting)
};

module.exports = nextConfig;



const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
  trailingSlash: true,  // Ensure proper static routing on GitHub Pages
};


