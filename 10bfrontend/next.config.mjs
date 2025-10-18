/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    workerThreads: false,
    cpus: 1
  },
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
};

export default nextConfig;
