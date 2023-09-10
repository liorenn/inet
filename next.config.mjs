// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
/** @type {import("next").NextConfig} */
import nextTranslate from 'next-translate-plugin'

export default nextTranslate({
  // output: 'export',
  reactStrictMode: true,
  distDir: 'build',
  compiler: {
    styledComponents: true,
  },
  swcMinify: true,
  exportPathMap: async function () {
    return {
      '/auth/account': { page: '/auth/account' },
      '/auth/resetpassword': { page: '/auth/resetpassword' },
      '/auth/signin': { page: '/auth/signin' },
      '/auth/signin/viaemail': { page: '/auth/signin/viaemail' },
      '/auth/signin/viaphone': { page: '/auth/signin/viaphone' },
      '/auth/signup': { page: '/auth/signup' },
      '/compare': { page: '/compare' },
      '/device': { page: '/device' },
      // Dynamic routes for device types and models
      '/device/[deviceType]': { page: '/device/[deviceType]' },
      '/device/[deviceType]/[model]': { page: '/device/[deviceType]/[model]' },
      '/favorites': { page: '/favorites' },
      // Add more routes as needed
    }
  },
})
