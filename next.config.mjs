import nextTranslate from 'next-translate-plugin'

export default nextTranslate({
  reactStrictMode: true,
  distDir: 'build',
  compiler: {
    styledComponents: true,
  },
  swcMinify: true,
})
