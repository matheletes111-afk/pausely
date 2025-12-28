/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@pausely/shared', '@pausely/ui', '@pausely/db', '@pausely/auth'],
};

module.exports = nextConfig;

