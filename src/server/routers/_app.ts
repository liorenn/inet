import { router } from '../trpc'
import { authRouter } from './auth'
import { DeviceRouter } from './device'

export const appRouter = router({
  auth: authRouter,
  device: DeviceRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
