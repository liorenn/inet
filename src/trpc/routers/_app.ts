import { router } from '../trpc'
import { authRouter } from './auth'
import { getUniqueDeviceRouter } from './getUniqueDevice'
import { getAllDevicesRouter } from './getAllDevices'

export const appRouter = router({
  auth: authRouter,
  UniqueDevice: getUniqueDeviceRouter,
  AllDevices: getAllDevicesRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
