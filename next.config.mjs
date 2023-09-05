// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
/** @type {import("next").NextConfig} */
import nextTranslate from 'next-translate-plugin'

export default nextTranslate({
  reactStrictMode: true,
  distDir: 'build',
  compiler: {
    styledComponents: true,
  },
  swcMinify: true,
})
