/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Required for static site generation (GitHub Pages)
  trailingSlash: true, // Recommended for GitHub Pages
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
