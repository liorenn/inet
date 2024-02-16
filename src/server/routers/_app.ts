import { DeviceRouter } from '@/server/routers/device'
import { authRouter } from '@/server/routers/auth'
import { router } from '@/server/trpc'

// export api routes handler
export const appRouter = router({
  auth: authRouter,
  device: DeviceRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
