import nextTranslate from 'next-translate-plugin'

/**
 * @type {import('next').NextConfig}
 */
const configs = {
  swcMinify: true,
  reactStrictMode: true,
  distDir: 'build',
  compiler: {
    styledComponents: true
  }
}

//export default configs
export default nextTranslate(configs)
