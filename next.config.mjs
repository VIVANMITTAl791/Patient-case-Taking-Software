/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false; // Yeh zlib / gunzip memory allocation error ko aane hi nahi dega
    }
    return config;
  },
};

export default nextConfig;