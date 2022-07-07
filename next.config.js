module.exports = {
  experimental: {
    externalDir: true
  },
  images: {
    domains: ['ipfs.lukso.network']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false // Fixes npm packages that depend on `fs` module
    }
    return config
  }
}
