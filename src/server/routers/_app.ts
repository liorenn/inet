import { router } from '../trpc'
import { AdminRouter } from './admin'
import { authRouter } from './auth'
import { DeviceRouter } from './device'

export const appRouter = router({
  auth: authRouter,
  admin: AdminRouter,
  device: DeviceRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
