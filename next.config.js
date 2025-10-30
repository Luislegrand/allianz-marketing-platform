/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    appDir: false, // garante que use /pages ao invés de /app
  },
  distDir: '.next', // diretório padrão do build
};

module.exports = nextConfig;
