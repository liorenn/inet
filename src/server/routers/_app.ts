import { authRouter } from '@/server/routers/auth'
import { deviceRouter } from '@/server/routers/device'
import { router } from '@/server/trpc'

// Create api routes handler
export const appRouter = router({
  auth: authRouter,
  device: deviceRouter,
})

// Create type definition of API
export type AppRouter = typeof appRouter
