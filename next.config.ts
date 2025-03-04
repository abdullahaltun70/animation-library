import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    implementation: 'sass-embedded',
  },
  typescript: {
    // Ignore type check during build, already performed as part of the CI/CD pipeline
    ignoreBuildErrors: true,
  },
}

export default nextConfig
