import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  output: 'standalone',
  
  // Configure MDX compiler
  experimental: {
    mdxRs: false, // Use @mdx-js/loader instead
  },
  
  // Allow images from external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Webpack configuration to reduce bundle size
  webpack: (config, { dev, isServer }) => {
    // Disable cache in production to prevent massive .next/cache from being bundled
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
}

// Configure MDX with remark and rehype plugins
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      import('remark-gfm'),
      import('remark-frontmatter'),
    ],
    rehypePlugins: [
      import('rehype-slug'),
    ],
    providerImportSource: '@mdx-js/react',
  },
})

// Export the combined configuration
export default withMDX(nextConfig)
